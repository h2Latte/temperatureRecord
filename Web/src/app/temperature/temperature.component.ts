import {Component, OnInit} from '@angular/core';
import {GetTemperatureService} from '../services/get-temperature.service';
import {layout} from './layout';

type DataFormat = {name: string, series: {name: string, value: number}[]}[];

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css'],
  providers: [GetTemperatureService],
})
export class TemperatureComponent implements OnInit /*, OnChanges */ {
  // "_date" contains the date selected by the DateComponent
  private _date: string;
  // "_plot" contains the DOM element to plot in
  private _plot: HTMLElement;
  // "_pins" contains all the pins number to get data from
  private _pins: number[] = [0, 1, 2, 3, 4, 5];
  // "_activePin" contains all the pins that the user want to display
  // TODO: change this attribute to be an array
  private _activePin = 0;
  // "_layout" contains the layout of the plot
  private _layout: any = layout;


  multi: DataFormat = [{
    name: 'Germany',
    series: [
      {
        'name': '2010',
        'value': 7300000
      },
      {
        'name': '2011',
        'value': 8940000
      }
    ]
  }];
  view: [number, number] = [700, 300];
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  yAxisLabel = 'température';
  timeline = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private temperatureService: GetTemperatureService) {
  }

  public ngOnInit(): void {
    this._plot = document.getElementById('plot');
    this._date = new Date().toISOString().slice(0, 10);
    // rescale the plot when the window size changes
    window.onresize = () => {
      // the width of the plot should be the body width, so the total window width
      this._layout.width = document.getElementsByTagName('body')[0].clientWidth;
      // Plotly.newPlot(this._plot, this._data, this._layout);
    };

  }

  private processTemperature(data): void {
    const time = Object.keys(data);
    const temperature = Object.values(data);
    // this.multi = [{
    //   x: time,
    //   y: temperature,
    //   name: `${this._date} A${this._activePin}`
    // }];
  }

  private getDataFromPinAtDate(): any {
    this.temperatureService.getDataFromPinAtDate(this._activePin, this._date).subscribe(data => {
      this.processTemperature(data);
      // Plotly.newPlot(this._plot, this._data, this._layout);
    });
  }


  private uniq(array: number[]): number[] {
    const seen: Object = {};
    const out: number[] = [];
    const len: number = array.length;
    let j = 0;

    for (let i = 0; i < len; i++) {
      const item: number = array[i];
      if (seen[item] !== 1) {
        seen[item] = 1;
        out[j++] = item;
      }
    }
    return out;
  }

  public onDateChanged(date: string): void {
    // update the "_date" attribute when user click in DateComponent
    this._date = date;
    // plot the new data
    this.getDataFromPinAtDate();
  }


  public setPin(value: number): void {
    // update the "_activePin" attribute when user click on pinComponent
    // TODO: implement array of pin
    this._activePin = value;
    console.log(this._activePin);
    // plot the new data
    this.getDataFromPinAtDate();
  }

  public getPins(): number[] {
    return this._pins;
  }

}


