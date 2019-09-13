class Nodes {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_nodes");
        this._element.innerHTML = `<h1>NODES<i>NAME | OS | STATUS</i></h1><br>
        <table id="mod_nodes_table"></table>`;
        this.parent.append(this._element);
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 5000);
    }
    async updateInfo() {
        const Client = require("kubernetes-client").Client;
        const client = new Client({ version: '1.13' })
        
        //
        // Get all the Nodes.
        //        
        
        await client.api.v1.nodes.get().then(nodes => {
            document.querySelectorAll("#mod_nodes_table > tr").forEach(el => {
                el.remove();
            });
            nodes.body.items.forEach(node => {
                node.status.conditions.forEach(condition => {
                    if (condition.type == "Ready") {
                        let el = document.createElement("tr");
                        el.innerHTML = `<td><strong>${this._trimDataString(node.metadata.name)}</strong></td>
                                <td>${this._trimDataString(node.status.nodeInfo.operatingSystem)}</td>
                                
                                <td>${this._trimDataString(condition.status)}</td>`;
                        document.getElementById("mod_nodes_table").append(el);
                    }
                });
            });
        }).catch(err => {
            document.querySelectorAll("#mod_nodes_table > tr").forEach(el => {
                el.remove();
            });
            let el = document.createElement("tr");
            if (err.message.includes("ECONN")) {
                el.innerHTML = `<td colspan='3'><strong>Cluster unreachable or KUBECONFIG not configured</strong></td></tr>`
            } else {
                el.innerHTML = `<td colspan='3'><strong>${err.message}</strong></td></tr>`;
                console.error('Error: ', err)
            }
            document.getElementById("mod_nodes_table").append(el);
        }); 
    }
    _trimDataString(str, ...filters) {
        return str.trim().split(" ").filter(word => {
            if (typeof filters !== "object") return true;

            return !filters.includes(word);
        }).slice(0, 2).join(" ");
    }
}


module.exports = {
    Nodes
};