#!/usr/bin/env python3
"""
Script to verify MCP servers are running and accessible
"""

import sys
import json
import subprocess
import time
from pathlib import Path

def check_mcp_server(server_name):
    """Check if a specific MCP server is accessible"""
    print(f"\n🔍 Checking {server_name} MCP server...")
    
    try:
        # Try to import and test the server
        if server_name == "memory":
            # Test memory server
            result = subprocess.run([
                sys.executable, "-c", 
                """
try:
    from mcp_memory import memory
    print('✅ Memory MCP server is accessible')
    print('   - Functions: create_entities, add_observations, search_nodes, read_graph')
except ImportError as e:
    print(f'❌ Memory MCP server not accessible: {e}')
except Exception as e:
    print(f'⚠️  Memory MCP server error: {e}')
"""
            ], capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(result.stdout.strip())
                return True
            else:
                print(f"❌ Memory server check failed: {result.stderr.strip()}")
                return False
                
        elif server_name == "sequential-thinking":
            # Test sequential thinking server
            result = subprocess.run([
                sys.executable, "-c", 
                """
try:
    from mcp_sequentialthi import sequentialthinking
    print('✅ Sequential Thinking MCP server is accessible')
    print('   - Functions: sequentialthinking for dynamic problem-solving')
except ImportError as e:
    print(f'❌ Sequential Thinking MCP server not accessible: {e}')
except Exception as e:
    print(f'⚠️  Sequential Thinking MCP server error: {e}')
"""
            ], capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(result.stdout.strip())
                return True
            else:
                print(f"❌ Sequential thinking server check failed: {result.stderr.strip()}")
                return False
                
        elif server_name == "context7":
            # Test context7 server
            result = subprocess.run([
                sys.executable, "-c", 
                """
try:
    from mcp_context7 import context7
    print('✅ Context7 MCP server is accessible')
    print('   - Functions: resolve-library-id, get-library-docs')
except ImportError as e:
    print(f'❌ Context7 MCP server not accessible: {e}')
except Exception as e:
    print(f'⚠️  Context7 MCP server error: {e}')
"""
            ], capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(result.stdout.strip())
                return True
            else:
                print(f"❌ Context7 server check failed: {result.stderr.strip()}")
                return False
        
        return False
        
    except subprocess.TimeoutExpired:
        print(f"⏰ Timeout checking {server_name} server")
        return False
    except Exception as e:
        print(f"❌ Error checking {server_name} server: {e}")
        return False

def check_mcp_config():
    """Check if MCP configuration exists"""
    print("🔍 Checking MCP configuration...")
    
    # Common MCP config locations
    config_paths = [
        Path.home() / ".config" / "mcp" / "config.json",
        Path.cwd() / "mcp_config.json",
        Path.cwd() / ".mcp" / "config.json"
    ]
    
    for config_path in config_paths:
        if config_path.exists():
            print(f"✅ Found MCP config at: {config_path}")
            try:
                with open(config_path) as f:
                    config = json.load(f)
                    servers = config.get("mcpServers", {})
                    print(f"   - Configured servers: {list(servers.keys())}")
                    return True
            except Exception as e:
                print(f"⚠️  Error reading config: {e}")
    
    print("❌ No MCP configuration found")
    return False

def main():
    """Main function to check all MCP servers"""
    print("🚀 MCP Servers Status Check")
    print("=" * 50)
    
    # Check configuration
    config_ok = check_mcp_config()
    
    # Check individual servers
    servers = ["memory", "sequential-thinking", "context7"]
    server_status = {}
    
    for server in servers:
        server_status[server] = check_mcp_server(server)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 SUMMARY")
    print("=" * 50)
    
    working_servers = [name for name, status in server_status.items() if status]
    failed_servers = [name for name, status in server_status.items() if not status]
    
    print(f"✅ Working servers: {working_servers if working_servers else 'None'}")
    if failed_servers:
        print(f"❌ Failed servers: {failed_servers}")
    
    if config_ok:
        print("✅ MCP configuration found")
    else:
        print("❌ MCP configuration missing")
    
    print(f"\n🎯 Status: {len(working_servers)}/{len(servers)} servers accessible")
    
    if len(working_servers) == len(servers) and config_ok:
        print("🎉 All MCP servers are running properly!")
        return 0
    else:
        print("⚠️  Some MCP servers need attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())
