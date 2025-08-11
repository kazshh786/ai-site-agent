import json

input_file = 'training_data.jsonl'
output_file = 'training_data_gemini_format.jsonl'

converted_lines = 0
errors = 0

print(f"--- Starting conversion from '{input_file}' to '{output_file}' ---")

with open(input_file, 'r', encoding='utf-8') as infile, \
     open(output_file, 'w', encoding='utf-8') as outfile:
    for i, line in enumerate(infile):
        try:
            # 1. Parse the original JSONL line
            original_entry = json.loads(line)
            prompt_text = original_entry.get('prompt')
            completion_json_string = original_entry.get('completion')

            if prompt_text is None or completion_json_string is None:
                print(f"Line {i+1}: Missing 'prompt' or 'completion' field. Skipping.")
                errors += 1
                continue

            # 2. Construct the new format
            new_entry = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": prompt_text}]
                    },
                    {
                        "role": "model",
                        "parts": [{"text": completion_json_string}] # The blueprint JSON string goes here
                    }
                ]
            }

            # 3. Write to the new output file
            outfile.write(json.dumps(new_entry, ensure_ascii=False) + '\n')
            converted_lines += 1

        except json.JSONDecodeError as e:
            print(f"Line {i+1}: JSON syntax error in original file - {e}. Skipping line.")
            errors += 1
        except Exception as e:
            print(f"Line {i+1}: Unexpected error during conversion - {e}. Skipping line.")
            errors += 1

print(f"\n--- Conversion Complete ---")
print(f"Successfully converted {converted_lines} lines.")
print(f"Errors encountered: {errors}")
print(f"New dataset saved to: '{output_file}'")

if errors > 0:
    print("Please review the skipped lines or errors reported.")
