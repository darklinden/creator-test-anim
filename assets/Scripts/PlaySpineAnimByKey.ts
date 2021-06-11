const { ccclass, property } = cc._decorator;

@ccclass
export class PlaySpineAnimByKey extends cc.Component {

    @property({ type: sp.Skeleton, visible: true })
    private animation: sp.Skeleton = null;

    private _completionDict: Dictionary<() => void> = {};

    private _playingAnim: string = null;

    public get playingAnim(): string {
        return this._playingAnim;
    }

    onRestore() {
        this.animation = this.animation || this.node.getComponent(sp.Skeleton);
    }

    public animNameList() {
        return Object.keys(this.animation.skeletonData.skeletonJson.animations);
    }

    public zzPlay(key: string = null, completion: () => void = null, isLoop: boolean = false) {
        if (!this.animation) return;

        let clip: string = null;
        if (key && key.length) {
            key = key.toLowerCase();

            const clipList = Object.keys(this.animation.skeletonData.skeletonJson.animations);
            for (let i = 0; i < clipList.length; i++) {
                if (clipList[i] && clipList[i].toLowerCase().indexOf(key) != -1) {
                    clip = clipList[i];
                    break;
                }
            }
        }
        else {
            clip = this.animation.animation;
        }

        if (!clip) return;

        this.animation.setCompleteListener(this.onSpineAnimEnded.bind(this));

        if (completion) {
            this._completionDict = this._completionDict || {};
            this._completionDict[clip] = completion;
        }

        this._playingAnim = clip;
        this.animation.setToSetupPose();
        this.animation.setAnimation(0, clip, isLoop);
    }

    private onSpineAnimEnded(entry: { animation: { name: string }, trackIndex: number }) {
        this._playingAnim = null;
        if (this.animation) {
            const name = (entry ? entry.animation.name : null);
            if (this._completionDict && this._completionDict[name]) {
                this._completionDict[name]();
                delete this._completionDict[name];
            }
        }
    }
}