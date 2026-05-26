class Agent:
    def __init__(self, name, priority):
        self.name = name
        self.priority = priority

    def request_resource(self):
        return {
            "agent": self.name,
            "priority": self.priority
        }

class ConflictResolver:
    def __init__(self):
        pass

    def resolve(self, requests):
        requests.sort(key=lambda x: x["priority"], reverse=True)
        return requests[0]  

agent1 = Agent("Agent_A", priority=2)
agent2 = Agent("Agent_B", priority=5)
agent3 = Agent("Agent_C", priority=3)

requests = [
    agent1.request_resource(),
    agent2.request_resource(),
    agent3.request_resource()
]

resolver = ConflictResolver()
winner = resolver.resolve(requests)

print("Conflict Resolution Result:")
print(f"{winner['agent']} wins the resource (Priority: {winner['priority']})")