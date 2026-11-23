import { grades, perspectives, weights } from './rules.mjs';

export const manualTitles = ['진단기준표', '세부입력기준'];

export function defaultManual() {
  const cells = [];
  const put = (r,c,value) => cells.push({r,c,value,ref:String.fromCharCode(64+c)+r});
  const merges = [];
  const factors = [3,2.5,2,1.5,1];
  for (const [type,top,title] of [['refusal',2,'거절결정'],['registration',14,'등록결정']]) {
    put(top,2,title);
    const keys = Object.keys(weights[type]);
    for (const [index,key] of keys.entries()) put(top,index+3,perspectives[key]);
    const [start,end] = [top+2,top+8];
    for (let row=start;row<=end;row++) {
      const grade=grades[row-start];
      if (row-start<5) put(row,2,grade);
      if (row-start<5) {
        for (const [index,key] of keys.entries()) put(row,index+3,'가중치 '+weights[type][key]+' × '+factors[row-start]);
      }
    }
    put(end-1,2,'주의 · 가중치에서 15점 감점');
    put(end,2,'부적합 · 가중치에서 30점 감점');
    merges.push([top,2,top+1,2]);
  }
  return [
    {title:manualTitles[0],top:2,left:2,cells,merges,rows:22,cols:8,widths:[5,27,29,29,29,29,29,19]},
    {title:manualTitles[1],top:2,left:1,cells:[{r:2,c:1,ref:'A2',value:'원문 매뉴얼을 등록해야 볼 수 있습니다.'}],merges:[],rows:2,cols:1,widths:[55]}
  ];
}
