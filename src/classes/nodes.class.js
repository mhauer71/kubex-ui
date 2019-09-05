class Nodes {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_nodes");
        this._element.innerHTML = `<div id="mod_nodes_inner">
            <div>
                <h1>NAME</h1>
                <h2 id="mod_nodes_name" >NONE</h2>
            </div>
            <div>
                <h1>OS</h1>
                <h2 id="mod_nodes_os" >NONE</h2>
            </div>
            <div>
                <h1>STATUS</h1>
                <h2 id="mod_nodes_status" >NONE</h2>
            </div>
        </div>`;

        this.parent.append(this._element);

        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 20000);
    }
    updateInfo() {
        //        async updateInfo() {

        /*
        window.si.system().then(d => {
            window.si.chassis().then(e => {
                document.getElementById("mod_hardwareInspector_manufacturer").innerText = this._trimDataString(d.manufacturer);
                document.getElementById("mod_hardwareInspector_model").innerText = this._trimDataString(d.model, d.manufacturer, e.type);
                document.getElementById("mod_hardwareInspector_chassis").innerText = e.type;
            });
        });
        */
        Client = require('kubernetes-client').Client
        try {
            const client = new Client({ version: '1.13' })
                //
                // Get all the Nodes.
                //        
            const nodes = client.api.v1.nodes.get()
                //const nodes = await client.api.v1.nodes.get()
            nodes.body.items.forEach(el => {
                /*
                console.log(el.metadata.name, );
                console.log(el.status.allocatable.cpu, "/", el.status.capacity.cpu, el.status.allocatable.memory, "/", el.status.capacity.memory, el.status.allocatable["ephemeral-storage"], "/", el.status.capacity["ephemeral-storage"], el.status.allocatable.pods, "/", el.status.capacity.pods);
                el.status.conditions.forEach(condition => {
                    console.log(condition.type, "/", condition.status);
                });
                console.log("OS:", el.status.nodeInfo.osImage, "Kernel:", el.status.nodeInfo.kernelVersion);
                */
                document.getElementById("mod_nodes_name").innerText = this._trimDataString(el.metadata.name);
                document.getElementById("mod_nodes_os").innerText = this._trimDataString(el.status.nodeInfo.operatingSystem);
                el.status.conditions.forEach(condition => {
                    if (condition.type == "Ready") {
                        document.getElementById("mod_nodes_status").innerText = this._trimDataString(condition.status);
                    }
                });
            });
        } catch (err) {
            console.error('Error: ', err)
        }
    }
}

main()