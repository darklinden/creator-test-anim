const { ccclass, property } = cc._decorator;

@ccclass
export class PlayCCAnimByKey extends cc.Component {

    @property({ type: cc.Animation, visible: true })
    private animation: cc.Animation = null;

    private _completionDict: Dictionary<() => void> = {};

    private _playingAnim: string = null;

    public get playingAnim(): string {
        return this._playingAnim;
    }

    onRestore() {
        this.animation = this.animation || this.node.getComponent(cc.Animation);
    }

    public animNameList() {
        const list = [];
        const clipList = this.animation.getClips();
        for (let i = 0; i < clipList.length; i++) {
            list.push(clipList[i].name);
        }
        return list;
    }

    public zzShowThumb(key: string = null) {
        if (!this.animation) return;

        let clip: string = null;
        if (key && key.length) {
            const clipList = this.animation.getClips();
            for (let i = 0; i < clipList.length; i++) {
                if (clipList[i] && clipList[i].name.toLowerCase().indexOf(key) != -1) {
                    clip = clipList[i].name;
                    break;
                }
            }

            if (!clip) return;
        }
        else {
            clip = this.animation.defaultClip.name;
        }

        this.animation.setCurrentTime(0, clip);
        this.animation.pause(clip);
        this.animation.sample(clip);
    }

    public zzPlay(key: string = null, completion: () => void = null) {
        if (!this.animation) return;

        this.animation.stop();

        if (!(key && key.length)) {
            key = this.animation.defaultClip.name;
            if (!(key && key.length)) {
                key = this.animation.getClips().length > 0 ? this.animation.getClips()[0].name : '';
            }
        }

        if (key) key = key.toLowerCase();

        let clip: string = null;
        const clipList = this.animation.getClips();
        for (let i = 0; i < clipList.length; i++) {
            if (clipList[i] && clipList[i].name.toLowerCase().indexOf(key) != -1) {
                clip = clipList[i].name;
                break;
            }
        }

        if (!clip) return;

        this.animation.on('finished', this.onCCAnimEnded, this);

        if (completion) {
            this._completionDict = this._completionDict || {};
            this._completionDict[clip] = completion;
        }

        this._playingAnim = clip;
        this.animation.play(clip, 0);
    }

    private onCCAnimEnded(type: string, state: cc.AnimationState) {
        this._playingAnim = null;
        if (this.animation) {
            const name = state ? state.name : null;
            if (this._completionDict && this._completionDict[name]) {
                const fun = this._completionDict[name];
                delete this._completionDict[name];
                fun();
            }
        }
    }
}