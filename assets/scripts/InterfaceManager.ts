import {
    _decorator, Component, Node, Button, Collider, color, ITriggerEvent, view,
    tween, Sprite, Vec3, Slider, UITransform, Tween, Prefab, Canvas, Camera
} from 'cc';
import platform from 'platform';

const { ccclass, property } = _decorator;

@ccclass('InterfaceManager')
export class InterfaceManager extends Component {

    @property(Sprite)
    hand: Sprite | null = null;

    @property(Button)
    button: Button | null = null;

    @property(Slider)
    slider: Slider | null = null;

    @property(Node)
    checkBoxes: Node | null = null;

    @property(Node)
    endGameDisplay: Node | null = null;


    private _handTween: Tween | null = null;


    start() {
        this._setHandTween();
        this._setEndButtonTween();
        let handle: Node = this.slider.node.getChildByName("Handle")
        this.button.node.on(Button.EventType.CLICK, this.redirectToStore, this);

        this.slider.node.once("slide", () => {
            if (this._handTween) {
                this.hand.destroy()
                this._handTween.destroySelf()
            }
        }, this);

        this.checkBoxes.getComponentsInChildren(Collider).forEach(
            (collider: Collider) => {
                collider.on("onTriggerEnter", this.showEndDisplay, this);
            }
        );

        const screenSize = view.getVisibleSize();
        const designResolution = view.getDesignResolutionSize();
        const scaleX = screenSize.width / designResolution.width;
        const scaleY = screenSize.height / designResolution.height;
        const scaleFactor = Math.min(scaleX, scaleY);
        this.node.setScale(scaleFactor, scaleFactor);

        this.endGameDisplay.getChildByName("Background")
            .getComponent(UITransform).width = screenSize.x
    }

    showEndDisplay(event: ITriggerEvent) {
        if (event.otherCollider.node.name === "Machine") {
            this.node.children.forEach((child: Node) => {
                const sprite: Sprite = child.getComponent(Sprite);
                if (sprite) {
                    sprite.color = color(0, 0, 0, 0)
                }
            }
            );

            setTimeout(() => {
                this.endGameDisplay.active = true;
                document.body.addEventListener("click", this.redirectToStore)
            }, 3500);
        }
    }

    redirectToStore(event: any) {
        const family: string = platform.os.family.toLowerCase();
        let link: string;

        if (family.includes("ios") || family.includes("os x")) {
            link = "https://apps.apple.com/us/app/ride-master-car-builder-game/id6449224139";

        } else {
            link = "https://play.google.com/store/apps/details?id=com.LuB.DeliveryConstruct&hl=en&pli=1";
        }

        window.location.replace(link);
    }

    _setHandTween() {
        let position: Vec3 = this.hand.node.getPosition();
        let destPoint: number = this.slider.getComponent(UITransform).contentSize.y;
        this._handTween =  tween(this.hand.node)
            .by(2, { position: new Vec3(0, destPoint, 0) }, { easing: "quadOut"})
            .to(0.1, {})
            .hide()
            .to(1, { position: position })
            .show()
            .union()
            .repeatForever()
            .start()
    }

    _setEndButtonTween() {
        tween(this.endGameDisplay.getChildByName("EndButton"))
            .to(1, { scale: new Vec3(0.8, 0.8, 0) })
            .to(1, { scale: new Vec3(0.5, 0.5, 0) })
            .union()
            .repeatForever()
            .start()
    }
}


