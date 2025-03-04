import {
    _decorator, Component, Node,
    RigidBody, ERigidBodyType,
    Collider, ITriggerEvent
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('LogController')
export class LogController extends Component {

    @property(Node)
    checkBox3: Node | null = null;

    private _logBodies: Array<RigidBody>;

    start() {
        this._logBodies = this.node.children
            .filter((logBody, _) => logBody.name.toLowerCase().includes("wood"))
            .sort((a, b) => b.position.x - a.position.x)
            .map((logBody, _) => logBody.getComponent(RigidBody));
        //this.startBridgeFall();
        this.checkBox3.getComponent(Collider).once("onTriggerEnter", (event: ITriggerEvent) => {
            if (event.otherCollider.node.name === "Machine") {
                this.startBridgeFall();
            }
        });

    }
    startBridgeFall() {
        //if (this._logBodies) {
            let delay: number = this._logBodies.length*40;
            this._logBodies.forEach((logBody) => {
                setTimeout(() => {
                    logBody.type = ERigidBodyType.DYNAMIC
                }, delay);
                delay *= 0.93;
            });
        //}
    }

    //update(deltaTime: number) {
        
    //}
}


