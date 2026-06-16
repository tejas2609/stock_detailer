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
    name: 'Tata Power',
    type: 'root',
    children: [
      {
        name: 'Market Performance',
        type: 'theme',
        children: [
          {
            name: 'Tata Power Company Q2 Results 2026',
            id: 'dedcf57b7f1448b4d4234004387b1701',
          },
          {
            name: 'Tata Power down: Despite record high FY26 profit, why shares got downgrade call ...',
            id: '2ed21e99a361f23866584bd7f18ff10c',
          },
          {
            name: 'Tata Power Company Ltd Technical Momentum Shifts Amid Mixed Indicator Signals - ...',
            id: '94bf70563c56fe44470b0995b214ad15',
          },
          {
            name: 'Tata Power Sees Surge in Call Option Activity Amid Bullish Momentum - Markets Mo...',
            id: '31a54289c989578332a4e771be66d259',
          },
          {
            name: 'Tata Power Company Ltd is Rated Sell - Markets Mojo',
            id: '76f67230fd7e6dd0d68c67b2e331334e',
          },
          {
            name: 'Tata Power Company Ltd Valuation Shifts Amidst Market Rally - Markets Mojo',
            id: '382f0d64878c8e723fcd9c93ead7aa94',
          },
        ],
      },
      {
        name: 'Company Strategy',
        type: 'theme',
        children: [
          {
            name: 'Tata Power sets July 7 for 107th AGM via video conference - scanx.trade',
            id: 'e969f425316197e0c8d350b22cdd7a23',
          },
          {
            name: 'UPPCL gets UPERC nod to import electricity from Tata Power-DGPC project in Bhuta...',
            id: '0fcd908d98c66b7a431a7db6f28c46d9',
          },
        ],
      },
      {
        name: 'Renewable Projects',
        type: 'theme',
        children: [
          {
            name: 'Tata Power, NHPC, Acme Solar, JSW Energy, NTPC, CESC: Target prices as valuation...',
            id: 'd02d49277dcd3828137943f79eda0fb1',
          },
          {
            name: 'Tata Power, Suzlon Energy, NHPC, Infosys Stocks Declared High Dividend, Bonus & ...',
            id: '522958bdf3123d4c18a0419060f24e89',
          },
        ],
      },
      { name: 'Standalone Article', type: 'standalone_article', children: [] },
      {
        name: 'Life in Dark! Villagers Suffer 15 Days Without Power; Tata Power Under Fire - Ka...',
        type: 'article',
      },
      {
        name: 'TATA POWER CO LTD Share Price Today - Live TATAPOWER Stock Price for NSE/BSE - U...',
        type: 'article',
      },
      {
        name: 'Adani Power Share Latest News🔴 L Tata Power Share Latest News L Adani Power Shar...',
        type: 'article',
      },
      {
        name: 'TATAPOWER Outlook for the Week (June 08, 2026 – June 12, 2026) - Equitypandit',
        type: 'article',
      },
      {
        name: 'UK low-emission project facing delay over power access issues: Tata Steel - Busi...',
        type: 'article',
      },
      {
        name: 'Dividends, bonuses and stock splits in June 2026: Reliance Industries, HDFC Bank...',
        type: 'article',
      },
      {
        name: 'Tata Power’s TPCODL employee apprehended by Odisha Vigilance while taking Rs 15,...',
        type: 'article',
      },
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
