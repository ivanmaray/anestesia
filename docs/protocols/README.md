# Protocols storage (private)

This folder contains documentation and instructions about protocol documents used by the project.

Important: The protocol PDF itself is NOT stored in this repository for privacy and security reasons.
Keep the original PDF in a private, access-controlled storage (S3, SharePoint, Google Drive, institutional storage, etc.).

Suggested process for handling the protocol:

1. Store the original protocol (if it contains no PHI/PII and no legal restrictions) in a secure location.
2. When working with the PDF locally, use the helper script in `scripts/extractProtocolSections.js` to extract text and create a mapping file.
3. If the file contains PHI/PII, generate an anonymized/sanitized version before sharing. The sanitized version can be stored in this repo under `docs/protocols/sanitized/` after a review.
4. Add metadata in `src/data/protocol_mapping.md` with the version, author, and checksum (SHA-256) of the private file to maintain traceability.

Local usage example (run from the repo root):

```bash
# install dependencies (one-time)
npm i --save-dev pdf-parse sha.js

# run the extraction script locally:
node scripts/extractProtocolSections.js "/path/to/Proyecto de cooperación estratégica ... (corregido).pdf"
```

The script will print simple text output and will create a `protocol-extract.json` file with the extracted text and basic metadata. This helps producing `protocol_mapping.md` entries without storing the full PDF in an open repository.

Contact: If you need me to add instructions for a secure upload or a process for the sanitized PDF review, tell me and I will extend this README with a checklist.
