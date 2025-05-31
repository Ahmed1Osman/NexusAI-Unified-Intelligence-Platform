import os
import json
import numpy as np
import faiss
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

class VectorMemory:
    def __init__(self, dimension=100, memory_file="vector_memories.json", index_file="vector_index.faiss", vectorizer_file="vectorizer.pkl"):
        self.dimension = dimension
        self.memory_file = memory_file
        self.index_file = index_file
        self.vectorizer_file = vectorizer_file
        
        # Initialize memories list
        self.memories = []
        self.memory_ids = []
        
        # Initialize or load vectorizer
        if os.path.exists(self.vectorizer_file):
            with open(self.vectorizer_file, 'rb') as f:
                self.vectorizer = pickle.load(f)
        else:
            self.vectorizer = TfidfVectorizer(max_features=self.dimension)
        
        # Initialize or load index
        if os.path.exists(self.index_file) and os.path.exists(self.memory_file):
            self.load_memories()
            self.load_index()
        else:
            # Create a new index
            self.index = faiss.IndexFlatL2(self.dimension)
    
    def load_memories(self):
        """Load memories from file"""
        try:
            if os.path.exists(self.memory_file):
                with open(self.memory_file, 'r') as f:
                    self.memories = json.load(f)
                self.memory_ids = [mem["id"] for mem in self.memories]
                print(f"Loaded {len(self.memories)} memories from {self.memory_file}")
            else:
                self.memories = []
                self.memory_ids = []
        except Exception as e:
            print(f"Error loading memories: {e}")
            self.memories = []
            self.memory_ids = []
    
    def load_index(self):
        """Load the FAISS index from file"""
        try:
            if os.path.exists(self.index_file) and self.memories:
                self.index = faiss.read_index(self.index_file)
                print(f"Loaded vector index from {self.index_file}")
            else:
                # Create a new index
                self.index = faiss.IndexFlatL2(self.dimension)
                # If we have memories but no index, rebuild the index
                if self.memories:
                    self._rebuild_index()
        except Exception as e:
            print(f"Error loading index: {e}")
            self.index = faiss.IndexFlatL2(self.dimension)
    
    def save_memories(self):
        """Save memories to file"""
        try:
            with open(self.memory_file, 'w') as f:
                json.dump(self.memories, f, indent=2)
            print(f"Saved {len(self.memories)} memories to {self.memory_file}")
        except Exception as e:
            print(f"Error saving memories: {e}")
    
    def save_index(self):
        """Save the FAISS index to file"""
        try:
            faiss.write_index(self.index, self.index_file)
            # Save the vectorizer
            with open(self.vectorizer_file, 'wb') as f:
                pickle.dump(self.vectorizer, f)
            print(f"Saved vector index to {self.index_file}")
        except Exception as e:
            print(f"Error saving index: {e}")
    
    def _rebuild_index(self):
        """Rebuild the vector index from memories"""
        if not self.memories:
            return
        
        # Extract content from memories
        texts = [mem["content"] for mem in self.memories]
        
        # Fit vectorizer if needed
        if not hasattr(self.vectorizer, 'vocabulary_'):
            self.vectorizer.fit(texts)
        
        # Transform texts to vectors
        vectors = self.vectorizer.transform(texts).toarray().astype('float32')
        
        # Create a new index
        self.index = faiss.IndexFlatL2(self.dimension)
        
        # Add vectors to index
        if vectors.shape[0] > 0:
            self.index.add(vectors)
    
    def _vectorize_text(self, text):
        """Convert text to vector"""
        # If vectorizer is not fitted yet, fit it
        if not hasattr(self.vectorizer, 'vocabulary_'):
            self.vectorizer.fit([text])
            
        # Transform text to vector
        vector = self.vectorizer.transform([text]).toarray().astype('float32')
        
        # Ensure vector has the correct dimension
        if vector.shape[1] != self.dimension:
            # Pad or truncate to match the expected dimension
            padded_vector = np.zeros((1, self.dimension), dtype=np.float32)
            copy_dim = min(vector.shape[1], self.dimension)
            padded_vector[0, :copy_dim] = vector[0, :copy_dim]
            return padded_vector
            
        return vector
    
    def add_memory(self, content, tags=None, source=None):
        """Add a new memory with vector embedding"""
        if tags is None:
            tags = []
            
        # Generate a new ID
        new_id = 1
        if self.memory_ids:
            new_id = max(self.memory_ids) + 1
        
        # Create memory object
        memory = {
            "id": new_id,
            "content": content,
            "tags": tags,
            "source": source,
            "created_at": datetime.now().isoformat(),
            "last_accessed": datetime.now().isoformat()
        }
        
        # Add to memories list
        self.memories.append(memory)
        self.memory_ids.append(new_id)
        
        # Add to vector index
        vector = self._vectorize_text(content)
        self.index.add(vector)
        
        # Save changes
        self.save_memories()
        self.save_index()
        
        return new_id
    
    def search_memories(self, query, k=5):
        """Search memories by semantic similarity"""
        # Convert query to vector
        query_vector = self._vectorize_text(query)
        
        # Search the index
        if self.index.ntotal == 0:
            return []  # No memories to search
            
        distances, indices = self.index.search(query_vector, min(k, self.index.ntotal))
        
        # Get the corresponding memories
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.memories):
                # Update last accessed time
                self.memories[idx]["last_accessed"] = datetime.now().isoformat()
                
                # Add distance score
                memory = dict(self.memories[idx])
                memory["relevance_score"] = float(1.0 / (1.0 + distances[0][i]))  # Convert to similarity score
                
                results.append(memory)
        
        # Sort by relevance score
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        # Save updated access times
        if results:
            self.save_memories()
            
        return results
    
    def search_by_tag(self, tag):
        """Search memories by tag"""
        results = []
        for memory in self.memories:
            if tag in memory["tags"]:
                # Update last accessed time
                memory["last_accessed"] = datetime.now().isoformat()
                results.append(memory)
        
        # Save updated access times
        if results:
            self.save_memories()
            
        return results
    
    def get_memory_by_id(self, memory_id):
        """Get a specific memory by ID"""
        for memory in self.memories:
            if memory["id"] == memory_id:
                # Update last accessed time
                memory["last_accessed"] = datetime.now().isoformat()
                self.save_memories()
                return memory
        return None
    
    def update_memory(self, memory_id, content=None, tags=None):
        """Update an existing memory"""
        for i, memory in enumerate(self.memories):
            if memory["id"] == memory_id:
                # Update content if provided
                if content is not None:
                    memory["content"] = content
                    
                    # Update vector in index
                    vector = self._vectorize_text(content)
                    
                    # For simplicity, we'll rebuild the index
                    # In a production system, you might want a more efficient approach
                    self._rebuild_index()
                
                # Update tags if provided
                if tags is not None:
                    memory["tags"] = tags
                
                # Update last modified time
                memory["last_accessed"] = datetime.now().isoformat()
                
                # Save changes
                self.save_memories()
                self.save_index()
                
                return True
                
        return False
    
    def delete_memory(self, memory_id):
        """Delete a memory"""
        for i, memory in enumerate(self.memories):
            if memory["id"] == memory_id:
                # Remove from memories list
                self.memories.pop(i)
                self.memory_ids.remove(memory_id)
                
                # Rebuild index
                self._rebuild_index()
                
                # Save changes
                self.save_memories()
                self.save_index()
                
                return True
                
        return False
    
    def add_tag_to_memory(self, memory_id, tag):
        """Add a tag to a memory"""
        for memory in self.memories:
            if memory["id"] == memory_id:
                if tag not in memory["tags"]:
                    memory["tags"].append(tag)
                    memory["last_accessed"] = datetime.now().isoformat()
                    self.save_memories()
                return True
        return False
    
    def get_all_memories(self):
        """Get all memories"""
        return self.memories
    
    def get_memory_stats(self):
        """Get statistics about the memories"""
        stats = {
            "total_memories": len(self.memories),
            "total_tags": len(set(tag for memory in self.memories for tag in memory["tags"])),
            "tags_frequency": {},
            "newest_memory": None,
            "oldest_memory": None,
            "most_accessed_memory": None
        }
        
        # Calculate tag frequencies
        all_tags = [tag for memory in self.memories for tag in memory["tags"]]
        for tag in set(all_tags):
            stats["tags_frequency"][tag] = all_tags.count(tag)
        
        # Find newest and oldest memories
        if self.memories:
            sorted_by_creation = sorted(self.memories, key=lambda x: x["created_at"])
            stats["oldest_memory"] = sorted_by_creation[0]
            stats["newest_memory"] = sorted_by_creation[-1]
            
            # Find most accessed memory
            sorted_by_access = sorted(self.memories, key=lambda x: x["last_accessed"], reverse=True)
            stats["most_accessed_memory"] = sorted_by_access[0]
        
        return stats
