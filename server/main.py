from fastapi import FastAPI, File, UploadFile
import boto3
from botocore.exceptions import NoCredentialsError
import os
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")
app = FastAPI()

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

@app.get("/")
async def list_buckets():
    try:
        response = s3_client.list_buckets()
        bucket_names = [bucket["Name"] for bucket in response["Buckets"]]

        objects = s3_client.list_objects_v2(Bucket="oizom-admin-app")
        file_list = [obj["Key"] for obj in objects.get("Contents", [])]

        print("file_list",file_list)
        print("bucket_names",bucket_names)
        return {"buckets": bucket_names}
    except Exception as e:
        return {"error": str(e)}

@app.get("/bucket/images")
async def list_device_images():
    try:
        objects = s3_client.list_objects_v2(Bucket=AWS_BUCKET_NAME, Prefix="devices/")

        image_files = [
            obj["Key"] for obj in objects.get("Contents", []) if obj["Key"].lower().endswith((".jpg", ".png"))
        ]

        image_urls = [
            f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{key}" for key in image_files
        ]
        return {"bucket": AWS_BUCKET_NAME, "images": image_urls}
    except Exception as e:
        return {"error": str(e)}

@app.get("/debug-bucket")
async def debug_bucket():
    try:
        objects = s3_client.list_objects_v2(Bucket=AWS_BUCKET_NAME)

        print("All objects:", objects)

        return objects

    except Exception as e:
        return {"error": str(e)}

# @app.post("/upload/")
# async def upload_video(file: UploadFile = File(...)):
#     try:
#         file_key = f"videos/{file.filename}"
#         s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, file_key, ExtraArgs={"ACL": "public-read"})

#         s3_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_key}"
#         return {"url": s3_url}

#     except NoCredentialsError:
#         return {"error": "AWS credentials not found"}

