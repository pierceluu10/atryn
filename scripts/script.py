import boto3
from botocore.exceptions import ClientError

REGION = "us-west-2"      # change if needed
TABLE_NAME = "Labs_New2"  # DynamoDB table to read from

def main():
    dynamodb = boto3.resource("dynamodb", region_name=REGION)
    table = dynamodb.Table(TABLE_NAME)

    try:
        response = table.scan()
        items = response.get("Items", [])

        while "LastEvaluatedKey" in response:
            response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            items.extend(response.get("Items", []))

        if not items:
            print("No items found.")
            return

        print(f"Found {len(items)} items:\n")
        for i, item in enumerate(items, 1):
            print(f"Item {i}:")
            print(item)
            print("-" * 40)

    except ClientError as e:
        print("AWS error:", e.response["Error"]["Message"])
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    main()