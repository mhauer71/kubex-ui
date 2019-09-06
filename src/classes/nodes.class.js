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
    //updateInfo() {
                async updateInfo() {

        const Client = require("kubernetes-client").Client;
        var today = new Date();
//        try {
            const client = new Client({ version: '1.13' })
                //
                // Get all the Nodes.
                //        
        //    const nodes = client.api.v1.nodes.get()
                 const nodes = await client.api.v1.nodes.get()
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
            /*
            .forEach( => {
                let el = document.createElement("tr");
                document.getElementById("mod_nodes_name").innerText = ;
                document.getElementById("mod_nodes_os").innerText = ;
                node.status.conditions.forEach(condition => {
                    if (condition.type == "Ready") {
                        document.getElementById("mod_nodes_status").innerText = this._trimDataString(condition.status);
                    }
                });
            });
            */
            /*
            document.getElementById("mod_nodes_name").innerText = today.getHours();
            document.getElementById("mod_nodes_os").innerText = today.getMinutes();
            document.getElementById("mod_nodes_status").innerText = today.getSeconds();
            */
//        } catch (err) {
//            console.error('Error: ', err)
 //       }
    }
    _trimDataString(str, ...filters) {
        return str.trim().split(" ").filter(word => {
            if (typeof filters !== "object") return true;

            return !filters.includes(word);
        }).slice(0, 2).join(" ");
    }
}
