import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph-container',
  standalone: true,
  imports: [],
  templateUrl: './graph-container.component.html',
  styleUrl: './graph-container.component.scss',
})
export class GraphContainerComponent implements OnInit, AfterViewInit {
  resp = {
    name: 'Reliance Industries',
    type: 'root',
    children: [
      {
        name: 'Market Performance',
        type: 'theme',
        children: [
          {
            name: "Moody's Upgrades Reliance",
            id: '652928866e05cf98c06a6600b45b2f16',
            source: 'The Economic Times',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMi_AFBVV95cUxNVmNfY2tEeG5nU25Xd2JmenltdHJubVNMQ25WSHBIS2J6WHhNZkxTdFhkaWZnTDZIM1lwalNlN1ZoVVUxUWpYNldTRFR6WHR5RzkyOUxLX3RveTluNGNnRmFuNF8wbjZWcEpJRHhOMzVCSk5nSGRqTHYxbHZGdDB4bkxwLWotWi1UenFJNkJ6V2p2M0VWYk1iNWRSQVFhbjk3MUpCOGVRRzVnME5wWGxtNHRGQVJPaGJ4U3h5M2hXTTRVQzJaR3J3NXFFSm1kM2VMc1BXSU85SUhIUGV1S3RvQTc1VTRTUGRKZWJSZjdUWUZsZjFkU0xVbkJZMFnSAYICQVVfeXFMTWpqV3JZX215QmtlWnhtTkpXVUx4RHJWQnVILUVqMDhhV202c1JVaVdBVlEzYjNNM2RacG1IbWtpYWNSRUZ4ZDFYb0ZuVkxWdG16anhGOVNqY1FEaHhiLVdSVHlxTFZXaDFGdE5XSkRORlNJbDhQLTJzd0twM2ZWUEI3WUV4YU9oU0ljSlVyQXhqbWpVSE0xWVBFUnp1SUFYaTRwcl9wYVR1ZGUteDB3ZVdVZEg1LThBWC1ZTXhVTTZSVUF2RTlxS2Vfdm9zd25uSnFyQzdVRi1iZi1WX0lVcXFfRm9Sc2FzT1B5U1ZXdzJCYVVvbkFOUG1VYUtid3pESmlR?oc=5',
          },
          {
            name: 'Reliance Industries Ltd Sees High Value Trading Amid Mixed Market Sentiment',
            id: '3b5f2560f4726e3262b464ed2131c639',
            source: 'Markets Mojo',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMizgFBVV95cUxQd0d5TXZtMHB0V0VvakRSZDQwQll1dkxwSXNwVHQ2TksxWFFkRmNSb2RqU0dCYjNLTF9TQkZva0dqeWd0WGpHekFTRi1QQmFSTE91YWYwVW50dHJlcTJTSXFWNjdNUXBVWnFfZmd1SkE5X2lvanJGeHB3STJOVC0wN0ljUDIwRWFqNEJRYl9CVWJrTFlza3ZFc1Y4MEp1cC1hZUNRVF9DS0paN2s2amlxZGZqRklNUm91Tmk3YVl0aFZUcW9ZQld1Z3RURVY3QQ?oc=5',
          },
          {
            name: 'Reliance Industries annual report 2026: Key insights, growth outlook, and what i...',
            id: '9382de8258a0e5a72a8d81ddddbafb3f',
            source: 'Upstox',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMi7gFBVV95cUxQdEl4VEtQUG55VHJrWTIyZmV4a2phYV9ZVXh3QmJYV1h1ZDFDNW5SSGZ6clpmb0RLWDZHSnMyYzJVWnJycXNRcV9UODk0V1JWQ2JIb056S0RnM3I4R3F6bjVqT0szU0pOWmtGVGw1dlBxSHhNbnVSbmJjNWxVN2RoMjIzQ09sd09QY09qeGpSZlZ2R2Q1WUxTVGExcWlwZ0lydFNaQUtPNGxwNFdZMkJJOGJ4UHAwYk5rT3JacFJuMDRDUUp3dlp6cExJWjl1V1l3UFBNWFNtYVlROXcxdkM2M1B2R2pZOFBwT05hdHNB?oc=5',
          },
        ],
      },
      {
        name: 'Company Strategy',
        type: 'theme',
        children: [
          {
            name: 'Ambani Says Reliance Evaluating ‘Strategic Pathways’ for Jio, No Word on IPO',
            id: '412d936dd0a4e6b47cf190edcc88b759',
            source: 'Bloomberg.com',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMiwgFBVV95cUxPWGdaNEZELTUxS25mblhYWkZ3RUx2eHh2Vk85eFFndUpLRHlJUm83ejY0NlhHekI5SklEdDJNYWotcEw4ZjVYTHJEYzNVbEJTUkdJS3c4b2ZXLUFDSVpVa0dGNUJXNjlFSjM5SnNKdk5fRllqdTdTTjNlakMyaTVyTVhnbFBxVGdhb1pwbkkwdlVpaTAwdUxJNGNXNjRyVVlsWnlJNXNERU0xZDNDUjcyc21yWkk1dkROWEY3VHJmMGMzZw?oc=5',
          },
          {
            name: 'Reliance Industries charts Jio IPO and new energy plans with battery, hydrogen r...',
            id: '617b88b4afd3d846b8a33b21950761bc',
            source: 'Telegraph India',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMi0gFBVV95cUxQOVdhYzYyWGZ4Zi1UZzVMLW0yR3lfMjBUOVFGQUFPZUVLSzVHa213d09iOEVLNkZqZ1g3QXRZbS0ycmsyZWdPV29PTmJVZFYwb0tER1ZNSWhPNDFrMVFSbDlPa3p1N1RyRXNOeHJ6RW85N3lGUEtNTVhsQjRTdThLYWx3bGFtZkhJUjduUGlrWVRKT28xS0c2T2ZIZG9pVUM0Z0tiajFvNFpBMldQN0lzMjM4cHNCZS1lY3hKeXQ2b2tyTHZ4OFRiY1o0WWZhMFdCclHSAdcBQVVfeXFMTU5FRE91MGhUVFEyQ1BzMm9VTkZJSW1XZndWcUl2YW83YWhSZ2FaQnZ1SXdsdXFOUlo0UWpRS09IMmdnM3ZQLTYxZkdKTWRTNnIwVUt1YUQ2QWZ6T0Roak82N1V1Q1lGUENER1pBdkpEVENSY2FKUGxsNmVsY3ZtNG42X2xNNVpEaEtBSzhfTm1ObEUtbVpIcWpqVWZ5WTNVcG1ueFIyMjJpMTVWSnpWWnY4OUpvLW9GUnM0TWVtNG05TFI1eWh6cTllYkw2VlVPRS10X2VmT1E?oc=5',
          },
        ],
      },
      {
        name: 'Regulatory Issues',
        type: 'theme',
        children: [
          {
            name: 'SC Sets Aside SEBI’s ₹447.27 Crore Disgorgement Order Against Reliance Industrie...',
            id: 'b9046489a8c2ed5745b11884dc402c40',
            source: 'LawStreet Journal',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMirAFBVV95cUxPQ1RPUmlOYjIwWjFYc19feUVoVGtXTXNfNjdIZDB1RGY4dXV4S3FUQlk0SVRhOE55c2YxT0R1dmN3WlBPUGZhQ1g2Mkc0Z2NCc1FGdmZYU2ZhR0c2M1pGbFVkRXNDUl8zTXhaZlVNZEhuTl9DbHdZSkItSmFoTXhZN0R2b24yVGIyMUlwc3h1QnBpcW9mZjgyWFpZazJWd3lGc0w0UkRxaElyVjlO?oc=5',
          },
          {
            name: 'Supreme Court sets aside order directing Reliance Industries to disgorge ₹447 cr...',
            id: 'a2f2a0a3f2162200166ca9fd4a118855',
            source: 'The Hindu',
            type: 'article',
            url: 'https://news.google.com/rss/articles/CBMi2AFBVV95cUxNdmdCdmZUTmtVMzN6aHAxT0tMNEdqOVllSzVRemxwNF91LU1zRHdXUGRDN29Ud1c3VnZOZGF2bE9LWjlzVUxzU0tDWjBqb2tGNHJYNGFYSk1tOW1iQlRmejlKTGlHekI2MlRvaU90SHlDMUpjMlVrZjBJOTVIejNyMkQxelZTRDFRUlJtWHl3N1ZtOHBYRjAzdC1waFkyZWNhSXdxMnJ3c0g4aGhRb2wzbzRya1NsUVNSVDh2VEF4U3k2TjRSQzI1Z0hJQVRMWUlLbUpPcFNMbG_SAd8BQVVfeXFMTTc0cV9ZRFVYbHN3aDNGQ1JzMU53Y0hUZEJWNHRiRVRKaWl1UU5zMlJCd004czg1REhmWHhBR2h6TVhiWHR3cEFYQmhVTDloZHRDUmlFN1FQdXpXN211MDhEeXc0cUdSMmxrNUdaR1JPdlhCVU1XYS1RMFJORUpITlF5Wk16QjdRaTl4clpCdU5hekVFQ2tDUTdpTjFaZ25UNHVVUC0tSHRRS0x0ZGRja3MyT0hKaFlhb1VienowRVZ6RmR0R1JkS2Y4emY3WjZmcHhET19YMUxIelRvQWxEaw?oc=5',
          },
        ],
      },
      { name: 'Standalone Article', type: 'standalone_article' },
    ],
  };
  data: any;
  @ViewChild('graphContainer', { static: true })
  treeContainer!: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    this.renderGraph();
  }

  renderGraph() {
    d3.select(this.treeContainer.nativeElement).selectAll('*').remove();

    const treeData = this.resp;

    const width = 2000;
    const height = 900;

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
      .style('max-width', '320px')
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

  buildTree(data: any) {
    const nodeMap = new Map();

    data.nodes.forEach((node: any) => {
      nodeMap.set(node.id, {
        id: node.id,
        name: node.title,
        data: node,
        children: [],
      });
    });

    const childIds = new Set();

    data.links.forEach((link: any) => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);

      if (sourceNode && targetNode && !childIds.has(link.target)) {
        sourceNode.children.push(targetNode);
        childIds.add(link.target);
      }
    });

    const rootChildren: any = [];

    data.nodes.forEach((node: any) => {
      if (!childIds.has(node.id)) {
        rootChildren.push(nodeMap.get(node.id));
      }
    });

    return {
      name: 'Tata Power',
      children: rootChildren,
    };
  }
}
