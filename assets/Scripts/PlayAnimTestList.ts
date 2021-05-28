const { ccclass, property } = cc._decorator;

import { PlayAnimTestListCell } from "./PlayAnimTestListCell";
import { PlayCCAnimByKey } from "./PlayCCAnimByKey";
import { PlayDragonAnimByKey } from "./PlayDragonAnimByKey";
import { PlaySpineAnimByKey } from "./PlaySpineAnimByKey";

@ccclass
export class PlayAnimTestList extends cc.Component {

    @property({ type: cc.ScrollView, visible: true })
    private _scroll: cc.ScrollView = null;

    @property({ type: PlayAnimTestListCell, visible: true })
    private _cell: PlayAnimTestListCell = null;


    @property({ type: PlayCCAnimByKey, visible: true })
    private _cc_anim: PlayCCAnimByKey = null;

    @property({ type: PlaySpineAnimByKey, visible: true })
    private _spine_anim: PlaySpineAnimByKey = null;

    @property({ type: PlayDragonAnimByKey, visible: true })
    private _dragon_anim: PlayDragonAnimByKey = null;


    start() {
        this.refreshScroll();
    }

    refreshScroll() {
        let animNameList: Array<string> = null;
        if (this._cc_anim) {
            animNameList = this._cc_anim.animNameList();
        }
        else if (this._spine_anim) {
            animNameList = this._spine_anim.animNameList();
        }
        else if (this._dragon_anim) {
            animNameList = this._dragon_anim.animNameList();
        }

        if (animNameList && animNameList.length) {
            for (let i = 0; i < Math.max(animNameList.length, this._scroll.content.childrenCount); i++) {
                if (i < animNameList.length) {
                    let n: cc.Node = null;
                    if (i < this._scroll.content.childrenCount) {
                        n = this._scroll.content.children[i];
                    }
                    else {
                        n = cc.instantiate(this._cell.node);
                        n.parent = this._scroll.content;
                        n.position = cc.Vec3.ZERO;
                    }

                    n.active = true;
                    const c = n.getComponent(PlayAnimTestListCell);
                    c.animName = animNameList[i];
                    c.onClicked = this.onCellClicked.bind(this);
                }
                else {
                    if (this._scroll.content.children[i])
                        this._scroll.content.children[i].active = false;
                }
            }
        }
    }

    public onCellClicked(cell: PlayAnimTestListCell) {
        if (this._cc_anim) {
            this._cc_anim.zzPlay(cell.animName);
        }
        else if (this._spine_anim) {
            this._spine_anim.zzPlay(cell.animName);
        }
        else if (this._dragon_anim) {
            this._dragon_anim.zzPlay(cell.animName);
        }
    }
}
