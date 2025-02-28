import { _decorator, Component, Node, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Node)
    car: Node;

    private _offset: Vec3;


    start() {
        let x: number = this.car.position.x - this.node.position.x
        let y: number = this.car.position.y - this.node.position.y
        this._offset = new Vec3(x, y, 0)
        const screenSize = view.getVisibleSize();
        console.log('Screen Size:', screenSize.width, screenSize.height);
    }
    update(deltaTime: number) {
        if (this.car) {
            const carPosition = this.car.getPosition();
            const targetPosition = new Vec3(
                carPosition.x - this._offset.x,
                carPosition.y - this._offset.y, 
                this.node.position.z 
            );
            this.node.setPosition(targetPosition);
        }
    }
}


