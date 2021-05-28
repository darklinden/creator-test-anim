const { ccclass, property, menu } = cc._decorator;

@ccclass
export class PlayCCAnimByKey extends cc.Component {

    private _animation: cc.Animation = null;
    private get animation(): cc.Animation {
        if (!this._animation) {
            this._animation = this.getComponent(cc.Animation);
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

        this.animation.play(clip, 0);
        this.scheduleOnce(() => {
            this.animation.pause();
            this.animation.setCurrentTime(0, clip);
            this.animation.sample(clip);
        });
    }

    public zzPlay(key: string = null, completion: () => void = null) {
        if (!this.animation) return;

        if (!(key && key.length)) {
            key = this.animation.defaultClip.name;
        }

        key = key.toLowerCase();

        this.animation.on('finished', this.onCCAnimEnded, this);

        let clip: string = null;
        const clipList = this.animation.getClips();
        for (let i = 0; i < clipList.length; i++) {
            if (clipList[i] && clipList[i].name.toLowerCase().indexOf(key) != -1) {
                clip = clipList[i].name;
                break;
            }
        }

        if (!clip) return;

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