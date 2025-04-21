import json

with open("smart_contracts/artifacts-zk/contracts/GrindRun.sol/GrindRun.json", "r") as f:
    j = json.load(f)

with open("crypto/GrindRun.json", "w") as f:
    json.dump(j["abi"], f, indent=2)