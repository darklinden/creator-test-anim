const { ccclass, property } = cc._decorator;

@ccclass
export class PlayAnimTestListCell extends cc.Component {

    @property({ type: cc.Label, visible: true })
    private _lbName: cc.Label = null;

    private _animName: string = null;
    public get animName(): string {
        return this._animName;
    }

    public set animName(v: string) {
        this._animName = v;
        this._lbName.string = v;
    }

    public onClicked: (cell: PlayAnimTestListCell) => void = null;

    zzBtnPlay() {
        this.onClicked && this.onClicked(this);
    }

    zzBtnCopy() {
        this.webCopyString(this._animName);
    }

    webCopyString(str: string) {
        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        // el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = getSelection();
        var originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) { }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
    }
}
