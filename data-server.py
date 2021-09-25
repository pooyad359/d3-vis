from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
import csv

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
path = Path("./data")


@app.get("/{ext}/{file}")
async def get_file_content(file, ext):
    try:
        filename = f"{file}.{ext}"
        filepath = path / filename
    except Exception as e:
        print("Error", e)
        return {"message": str(e)}
    if filepath.exists():
        with open(filepath) as fp:
            if ext == "csv":
                content = csv.DictReader(fp)
                return list(content)
            if ext == "json":
                content = json.load(fp)
                return content

        print("Success")
        return {"message": "File Exists"}
    else:
        print("Fail")
        return {"message": "File Doesn't Exists"}


if __name__ == "__main__":
    app.run()