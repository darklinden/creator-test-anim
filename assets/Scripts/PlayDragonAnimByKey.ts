const { ccclass, property, menu } = cc._decorator;

@ccclass
export class PlayDragonAnimByKey extends cc.Component {

    private _animation: dragonBones.ArmatureDisplay = null;
    private get animation(): dragonBones.ArmatureDisplay {
        if (!this._animation) {
            this._animation = this.getComponent(dragonBones.ArmatureDisplay);
        }
        return this._animation;
    }

    private _completionDict: Dictionary<() => void> = {};

    private _playingAnim: string = null;

    public get playingAnim(): string {
        return this._playingAnim;
    }

    public animNameList() {
        const list = [];
        const armature = this.animation.getArmatureNames();
        for (const k in armature) {
            const clipList = this.animation.getAnimationNames(armature[k]);
            for (let i = 0; i < clipList.length; i++) {
                list.push(clipList[i]);
            }
        }
        return list;
    }

    public zzPlay(key: string = null, completion: () => void = null, isLoop: boolean = false) {
        if (!this.animation) return;

        let clip: string = null;
        if (key && key.length) {
            key = key.toLowerCase();

            this.animation.on(dragonBones.EventObject.COMPLETE, this.onDragonBonesAnimEnded, this);

            const armature = this.animation.getArmatureNames();
            for (const k in armature) {
                const clipList = this.animation.getAnimationNames(armature[k]);
                for (let i = 0; i < clipList.length; i++) {
                    if (clipList[i] && clipList[i].toLowerCase().indexOf(key) != -1) {
                        clip = clipList[i];
                        break;
                    }
                }
            }

            if (!clip) return;
        }
        else {
            clip = this.animation.animationName;
        }

        if (completion) {
            this._completionDict = this._completionDict || {};
            this._completionDict[clip] = completion;
        }

        this._playingAnim = clip;
        this.animation && (this.animation.playAnimation(clip, isLoop ? 0 : -1));

    }

    private onDragonBonesAnimEnded(event: cc.Event, placeholder?: any) {
        this._playingAnim = null;
        if (this.animation) {
            const name = this.animation ? this.animation.animationName : '';
            if (this._completionDict && this._completionDict[name]) {
                this._completionDict[name]();
                delete this._completionDict[name];
            }
        }
    }
}