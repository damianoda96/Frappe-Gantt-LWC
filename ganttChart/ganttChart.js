import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import momentJS from '@salesforce/resourceUrl/momentJS';
import snapSVG from '@salesforce/resourceUrl/snapSVG';
import frappeGanttMin from '@salesforce/resourceUrl/frappeGanttJS';
import frappeGanttStyle from '@salesforce/resourceUrl/frappeGanttStyle';
import jQuery from '@salesforce/resourceUrl/jquery351';

export default class GanttChart extends LightningElement {
    @api recordId;
    @track error;
    @track chartjsInitialized = false;
    @track viewMode = 'day';

    connectedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        console.log('chart loading');
        Promise.all([
            loadScript(this, momentJS),
            //loadScript(this, snapSVG),
            loadScript(this, jQuery),
            loadScript(this, frappeGanttMin),
            loadStyle(this, frappeGanttStyle)
        ])
        .then(() => {
            this.initializeChartJS();
        })
        .catch(error => {
            this.error = error;
            console.log('Error: ' + error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading chart',
                    message: error.message,
                    variant: 'error'
                })
            );
        });
    }

    initializeChartJS() {
        console.log("loaded");
        //Get the context of the canvas element we want to select
        var chartClass = this.template.querySelector(".gantt");
        var tasks = [
            {
              id: 'Task 1',
              name: 'Redesign website',
              start: '2016-10-28',
              end: '2017-02-31',
              progress: 20
            },
            {
                id: 'Task 1',
                name: 'Redesign website',
                start: '2016-12-28',
                end: '2017-04-31',
                progress: 20
              }
          ]

        var gantt = new Gantt(chartClass, tasks);
        gantt.change_view_mode('Month');

    }

}