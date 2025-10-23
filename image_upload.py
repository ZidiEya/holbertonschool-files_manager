import base64   # Used to encode binary file data into a Base64 string
import requests # Used to make HTTP requests to the API
import sys      # Used to read command-line arguments

# Get command-line arguments
# Usage example: python upload_file.py <file_path> <X-Token> <parentId>
file_path = sys.argv[1]   # The local path of the file to upload
file_name = file_path.split('/')[-1]  # Extracts just the file name (after the last '/')

# Initialize variable for encoded file content
file_encoded = None

# Open the file in binary mode and Base64-encode its contents
with open(file_path, "rb") as image_file:
    # Convert binary data to Base64 string (UTF-8 encoded)
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

# Prepare the JSON payload to send to the API
r_json = {
    'name': file_name,        # Name of the file
    'type': 'image',          # File type (you can change it to 'folder' or 'file' if needed)
    'isPublic': True,         # Whether the file should be publicly accessible
    'data': file_encoded,     # The Base64-encoded file data
    'parentId': sys.argv[3]   # The parent folder ID (or 0 for root)
}

# Add the authorization token to the request headers
r_headers = {
    'X-Token': sys.argv[2]    # The authentication token from the API login
}

# Send a POST request to upload the file to the API
r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)

# Print the JSON response from the API (success or error message)
print(r.json())
