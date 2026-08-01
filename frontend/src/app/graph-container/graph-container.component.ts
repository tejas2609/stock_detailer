import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as d3 from 'd3';
import { StockSharedService } from '../shared/services/stocks/stockShared.service';
import { StockNewsService } from '../shared/services/news/stockNews.service';
import { SharedModule } from '../shared/shared.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-graph-container',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './graph-container.component.html',
  styleUrl: './graph-container.component.scss',
   animations: [
    trigger('messageAnimation', [
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translateY(18px)'
        }),
        animate(
          '450ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ])
    ])
  ]
})
export class GraphContainerComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked{
  resp = {};
  data: any;

  @ViewChild('graphContainer')
  treeContainer!: ElementRef;

  selectedStock: string = '';
  loading: boolean = true;

  private newsSub?: Subscription;
  private graphDrawn = false;

  messages: string[] = [
    'Hold tight, getting news for you...',
    'Fetching the latest market updates...',
    'Getting the insights notched for you...',
    'Scanning trusted financial sources...',
    'Looking for what matters most...',
    'Analyzing market sentiment...',
    'Finding key developments...',
    'Almost there...'
  ];

  currentIndex = 0;

  private interval!: ReturnType<typeof setInterval>;

  constructor(private stockSharedService: StockSharedService, private stockNewsService: StockNewsService) {}

  ngOnInit() {
    this.newsSub = this.stockNewsService.stockNewsEmitter.subscribe((news: any) => {
      this.data = news;
      this.loading = false;
      this.graphDrawn = false;
    });

    if (!this.interval) {
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;
      }, 5000);
    }

    this.loadStockNews();
  }

  private loadStockNews() {
    this.selectedStock = this.stockSharedService.getSelectedStock();

    if (this.selectedStock === '') {
      this.loading = false;
      this.data = undefined;
      return;
    }

    this.loading = true;
    this.data = undefined;
    this.graphDrawn = false;
    this.stockNewsService.getStockNews(this.selectedStock);
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    if (!this.loading && this.data && this.treeContainer && !this.graphDrawn) {
      this.graphDrawn = true;
      this.renderGraph();
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }
  }

  renderGraph() {
    d3.select(this.treeContainer.nativeElement).selectAll('*').remove();

    const treeData = this.data;

    const width = this.treeContainer.nativeElement['clientWidth'];
    const height = this.treeContainer.nativeElement['clientHeight'];

    const svg = d3
      .select(this.treeContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#ffffff');

    const g = svg.append('g').attr('transform', 'translate(100,50)');

    const root = d3.hierarchy(treeData);

    const treeLayout = d3.tree<any>().size([height - 100, width - 350]);

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#1f2937')
      .style('color', '#fff')
      .style('padding', '12px 16px')
      .style('border-radius', '12px')
      .style('font-size', '13px')
      .style('max-width', '500px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('box-shadow', '0 8px 24px rgba(0,0,0,0.35)');

    treeLayout(root);

    /*
     LINKS
    */
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .linkHorizontal<any, any>()
          .x((d: any) => d.y)
          .y((d: any) => d.x),
      )
      .attr('fill', 'none')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 1.5);

    /*
     NODES
    */
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    /*
     CIRCLE
    */
    node
      .append('circle')
      .attr('r', (d: any) => {
        if (d.depth === 0) return 8;
        if (d.depth === 1) return 6;

        return 4;
      })
      .attr('fill', (d: any) => {
        if (d.depth === 0) return '#f59e0b';
        if (d.depth === 1) return '#3b82f6';

        return '#000000';
      });

    /*
     LABELS
    */
    node
      .append('text')
      .text((d: any) => {
        if (d.depth === 0) return d.data.name;

        return d.data.name.length > 50
          ? d.data.name.slice(0, 50) + '...'
          : d.data.name;
      })
      .attr('dy', 4)
      .attr('x', (d: any) => (d.children ? -12 : 12))
      .style('text-anchor', (d: any) => (d.children ? 'end' : 'start'))
      .style('fill', '#000')
      .style('font-size', '12px');

    /*
     CLICK EVENT
    */
    node.on('click', (_, d: any) => {
      console.log('clicked node:', d.data);
    });

    node
      .on('mouseenter', function (event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', `translate(${d.y},${d.x}) scale(1.25)`);

        tooltip.transition().duration(150).style('opacity', 1);

        tooltip
          .html(
            `
          <div style="font-weight:600; line-height:1.5;">
            ${d.data.name}
          </div>
        `,
          )
          .style('left', event.pageX + 15 + 'px')
          .style('top', event.pageY - 20 + 'px');
      })

      .on('mousemove', function (event: any) {
        tooltip
          .style('left', event.pageX + 15 + 'px')
          .style('top', event.pageY - 20 + 'px');
      })

      .on('mouseleave', function (event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', `translate(${d.y},${d.x}) scale(1)`);

        tooltip.transition().duration(150).style('opacity', 0);
      });

    /*
     ZOOM + PAN
    */
    svg.call(
      d3
        .zoom<any, any>()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        }),
    );
  }

  
}