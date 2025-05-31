import os
import PyPDF2
from pdfminer.high_level import extract_text
import pytesseract
from PIL import Image
import re

class DocumentProcessor:
    def __init__(self, tesseract_path=None):
        # Set Tesseract path if provided
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        else:
            # Default paths for common installations
            if os.path.exists(r'C:\Program Files\Tesseract-OCR\tesseract.exe'):
                pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            elif os.path.exists(r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'):
                pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'
        
        # Create directory for document storage
        self.docs_dir = "documents"
        if not os.path.exists(self.docs_dir):
            os.makedirs(self.docs_dir)
    
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from a PDF file using multiple methods for better results"""
        try:
            # Try pdfminer.six first (better for text extraction)
            text = extract_text(pdf_path)
            
            # If pdfminer didn't get much text, try PyPDF2 as backup
            if len(text.strip()) < 100:
                text = self._extract_with_pypdf2(pdf_path)
                
            return text
        except Exception as e:
            return f"Error extracting text from PDF: {str(e)}"
    
    def _extract_with_pypdf2(self, pdf_path):
        """Extract text using PyPDF2 as a backup method"""
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n"
        return text
    
    def perform_ocr(self, image_path, language='eng'):
        """Extract text from an image using OCR"""
        try:
            # Clean up file path - handle URL-encoded paths and file:// protocol
            if image_path.startswith('file:///'):
                image_path = image_path[8:]  # Remove file:/// prefix
            
            # Replace URL encoding if present
            image_path = image_path.replace('%20', ' ')
            
            # Special handling for Windows screenshots
            # If path doesn't exist and doesn't have an extension, try common image extensions
            if not os.path.exists(image_path):
                # Check if it's a Windows screenshot without extension
                if "Screenshot" in image_path and not os.path.splitext(image_path)[1]:
                    # Try common screenshot extensions
                    for ext in [".png", ".jpg", ".jpeg", ".bmp"]:
                        test_path = image_path + ext
                        if os.path.exists(test_path):
                            print(f"Found matching screenshot file: {test_path}")
                            image_path = test_path
                            break
            
            # Check if file exists after trying extensions
            if not os.path.exists(image_path):
                # Try to list available files in the directory to help the user
                try:
                    parent_dir = os.path.dirname(image_path)
                    if os.path.exists(parent_dir):
                        files = os.listdir(parent_dir)
                        screenshot_files = [f for f in files if "screenshot" in f.lower()]
                        if screenshot_files:
                            suggestions = "\nAvailable screenshot files:\n- " + "\n- ".join(screenshot_files)
                            return f"Error performing OCR: File not found: {image_path}{suggestions}"
                except Exception:
                    pass  # If we can't list directory contents, just continue with normal error
                    
                return f"Error performing OCR: File not found: {image_path}"
                
            # Check if it's a directory
            if os.path.isdir(image_path):
                return f"Error performing OCR: {image_path} is a directory, not a file"
                
            # Open and process the image
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang=language)
            return text
        except Exception as e:
            return f"Error performing OCR: {str(e)}"
    
    def extract_resume_info(self, text):
        """Extract key information from a resume"""
        # Basic extraction of common resume sections
        info = {}
        
        # Extract email
        email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
        if email_match:
            info['email'] = email_match.group(0)
        
        # Extract phone number (various formats)
        phone_match = re.search(r'(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}', text)
        if phone_match:
            info['phone'] = phone_match.group(0)
        
        # Extract education (simple approach)
        education_keywords = ['Bachelor', 'Master', 'PhD', 'BSc', 'MSc', 'MBA', 'Degree']
        education_section = []
        for keyword in education_keywords:
            if keyword in text:
                # Get the sentence containing the keyword
                sentences = re.findall(r'[^.!?]*' + keyword + r'[^.!?]*[.!?]', text)
                education_section.extend(sentences)
        
        if education_section:
            info['education'] = education_section
        
        # Extract skills (simple approach)
        skills_section = None
        if 'Skills' in text:
            skills_section = text.split('Skills')[1].split('\n\n')[0]
        elif 'SKILLS' in text:
            skills_section = text.split('SKILLS')[1].split('\n\n')[0]
        
        if skills_section:
            # Extract individual skills
            skills = re.findall(r'\b[A-Za-z][A-Za-z+#.\-]{2,}\b', skills_section)
            if skills:
                info['skills'] = list(set(skills))  # Remove duplicates
        
        return info
    
    def save_document(self, file_path, document_type='other'):
        """Save a document to the documents directory and extract its text"""
        try:
            # Clean up file path - handle URL-encoded paths and file:// protocol
            if file_path.startswith('file:///'):
                file_path = file_path[8:]  # Remove file:/// prefix
            
            # Replace URL encoding if present
            file_path = file_path.replace('%20', ' ')
            
            # Special handling for files without extension
            if not os.path.exists(file_path):
                # Check if it's a file without extension
                base_path = file_path
                base_name = os.path.basename(file_path)
                
                # If no extension, try common document extensions
                if not os.path.splitext(base_path)[1]:
                    # Try common document extensions
                    for ext in [".pdf", ".docx", ".doc", ".txt"]:
                        test_path = base_path + ext
                        if os.path.exists(test_path):
                            print(f"Found matching document file: {test_path}")
                            file_path = test_path
                            break
            
            # Check if file exists after trying extensions
            if not os.path.exists(file_path):
                # Try to list available files in the directory to help the user
                try:
                    parent_dir = os.path.dirname(file_path)
                    if os.path.exists(parent_dir):
                        files = os.listdir(parent_dir)
                        # Filter for document files that might match
                        base_name_lower = os.path.basename(file_path).lower()
                        similar_files = [f for f in files if base_name_lower in f.lower() 
                                        or (len(base_name_lower) > 3 and base_name_lower[:4] in f.lower())]
                        
                        if similar_files:
                            suggestions = "\nSimilar files found in directory:\n- " + "\n- ".join(similar_files)
                            return {"error": f"File not found: {file_path}{suggestions}"}
                except Exception:
                    pass  # If we can't list directory contents, just continue with normal error
                
                return {"error": f"File not found: {file_path}"}
                
            # Check if it's a directory
            if os.path.isdir(file_path):
                return {"error": f"{file_path} is a directory, not a file"}
            
            # Create a copy of the document in our documents directory
            filename = os.path.basename(file_path)
            new_path = os.path.join(self.docs_dir, filename)
            
            # Copy the file
            with open(file_path, 'rb') as src, open(new_path, 'wb') as dst:
                dst.write(src.read())
            
            # Extract text based on file type
            text = ""
            if file_path.lower().endswith('.pdf'):
                text = self.extract_text_from_pdf(new_path)
            elif file_path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
                text = self.perform_ocr(new_path)
            else:
                # For other file types, try to read as text
                try:
                    with open(new_path, 'r', encoding='utf-8') as f:
                        text = f.read()
                except Exception:
                    text = "Could not extract text from this file type."
            
            result = {
                "filename": filename,
                "path": new_path,
                "type": document_type,
                "text": text,
                "metadata": {}
            }
            
            # Extract additional metadata for specific document types
            if document_type.lower() == 'resume' and text:
                result["metadata"] = self.extract_resume_info(text)
            
            return result
        except Exception as e:
            return {"error": str(e)}
