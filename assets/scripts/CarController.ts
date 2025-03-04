import {
    _decorator, Component, Node, ITriggerEvent, ERigidBodyType,
    Slider, ConstantForce, Vec3, Quat, Collider, RigidBody, Animation
} from 'cc';
import platform from 'platform';

const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {

    @property(Slider)
    slider: Slider | null = null;

    @property(Node)
    wheel1: Node | null;
    @property(Node)
    wheel2: Node | null;
    @property(Node)
    wheel3: Node | null;
    @property(Node)
    wheel4: Node | null;

    @property(Number)
    maxForce: number = 40;

    @property(Animation)
    destroyingAnimation: Animation | null = null;

    @property(Node)
    checkBox1: Node | null = null;
    @property(Node)
    checkBox2: Node | null = null;


    private _wheels: Node[];
    private _force: ConstantForce;


    start() {
        this._force = this.node.getComponent(ConstantForce);
        this._wheels = [
            this.wheel1, this.wheel2, this.wheel3, this.wheel4
        ];
        //let colliders: Collider[] = this.node.getComponents(Collider);
        //colliders = colliders.concat( this.getComponentsInChildren(Collider) )
        //colliders.forEach( (collider) => {
        //    collider.on("onCollisionEnter", (event: ITriggerEvent) => {
        //        const body: RigidBody = event.otherCollider.getComponent(RigidBody)

        //        if (body.getGroup() === 16) {
        //            body.type = ERigidBodyType.DYNAMIC
        //        }
        //    }, this)
        //})
        
        this.checkBox1.getComponent(Collider).once("onTriggerEnter", (event: ITriggerEvent) => {
            this.destroyingAnimation.play("DestroyingAnimation");
            this.destroyCar(event)
        }, this)
        this.checkBox2.getComponent(Collider).on("onTriggerEnter", (event: ITriggerEvent) => {
            this.destroyCar(event)
        }, this)
    }

    update(deltaTime: number) {
        this.updateWheels()
        this.updateForce(deltaTime)
    }

    updateWheels(){
        if (this._wheels) {
            this._wheels.forEach( (wheel) => {
                const rotation: Quat = wheel.getRotation();
                const incrementalRotation = Quat.fromAxisAngle(new Quat(), new Vec3(0, 1, 0), (this.slider.progress) / 10);
                const newRotation = Quat.multiply(new Quat(), rotation, incrementalRotation);
                wheel.setRotation(newRotation);
            });
        }
    }
    updateForce(deltaTime: number) {
        this._force.force.x += ( 200 * ( this.slider.progress * 2 - 1 ) - 5 ) * deltaTime;

        if (this._force.force.x > this.maxForce) {
            this._force.force.x = this.maxForce;

        } else if (this._force.force.x < 0) {
            this._force.force.x = 0;
        }

    }

    destroyCar(event: ITriggerEvent) {
        if (event.otherCollider.node === this.node) {
            this.getComponent(RigidBody).enabled = false;
            this.getComponents(Collider).forEach((collider) => { collider.enabled = false });
            this.node.children.forEach((childNode: Node) => {
                let childRigidBody: RigidBody = childNode.getComponent(RigidBody);
                let childCollider: Collider = childNode.getComponent(Collider);

                if (childCollider) {
                    childCollider.enabled = true;
                }
            });
        }
    }
}



