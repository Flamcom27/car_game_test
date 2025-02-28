import {
    _decorator, Component, ITriggerEvent, Collider, view, Vec2,
    Label, Prefab, instantiate, Canvas, Camera, Vec3, tween
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CollectCoin')
export class CollectCoin extends Component {

    @property(Label)
    counter: Label | null;

    @property(Prefab)
    coinPrefab: Prefab | null = null;

    @property(Canvas)
    canvas: Canvas | null = null;

    @property(Camera)
    mainCamera: Camera | null = null;


    start() {
        const colliders: Collider[] = this.getComponentsInChildren(Collider);
        colliders.forEach((collider: Collider) => {
            collider.on("onTriggerEnter", this.onTriggerEnter, this);
        });

    }
    onTriggerEnter(event: ITriggerEvent) {
        if (this.counter) {
            this.counter.string = (Number(this.counter.string) + 1).toString()
        }

        

        if (this.canvas && this.coinPrefab && this.mainCamera) {
            const coin = instantiate(this.coinPrefab);
            const screenPos = this.mainCamera.worldToScreen(
                event.selfCollider.node.worldPosition
            )
            //position.x -= 150;
            //position.y -= 300;
            //console.log(event.otherCollider.name, ": ", position)
            coin.scale = new Vec3(0.5, 0.5, 0);
            this.canvas.node.addChild(coin);
            const viewportRect = view.getViewportRect();
            const canvasSize = view.getVisibleSize();
            const canvasPos = new Vec3(
                (screenPos.x / viewportRect.width) * canvasSize.width/10,
                (screenPos.y / viewportRect.height) * canvasSize.height/10, 0
            );
            console.log(canvasPos);
            coin.setPosition(canvasPos);

            tween(coin)
                .to(1, { position: this.counter.node.parent.position })
                .destroySelf()
                .start();
        }
        event.selfCollider.node.destroy()
    }
}


