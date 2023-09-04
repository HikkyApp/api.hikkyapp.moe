export default class Monitor {
    // Is monitor disabled
    isDisabled: boolean;
    // Monitor is still working but won't send request.
    isRequestDisabled: boolean;

    interval: number;
    // Old data
    oldData: any;

    shouldChange: (oldData: any, newData: any) => boolean
    // To get data
    onRequest: () => Promise<any>

    constructor(
        onRequest: () => Promise<any>,
        shouldChange: (oldData: any, newData: any) => boolean
    ) {

        this.shouldChange = shouldChange;
        this.onRequest = onRequest;

        this.interval = 1_200_000; //20 minutes
        this.isDisabled = false;
        this.isRequestDisabled = false;

    }

    onMonitorChange() {
        console.log("Method onMonitorChange not implemented");
    }

    run() {
        if (this.isDisabled) return;

        setInterval(this.check.bind(this), this.interval);
    }

    async check() {
        if (this.isRequestDisabled) {
            this.onMonitorChange();
            return;
        }

        const data = await this.onRequest();

        const shouldChange = await this.shouldChange(this.oldData, data);

        if (shouldChange) {
            this.onMonitorChange();
        }

        this.oldData = data;
    }

}