import '../style/my_chart.css';

interface MyChartProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}
export default function MyChart(props: MyChartProps){
  return (
    <div className='chart_container'>
      <canvas ref={props.canvasRef}>
        'msg for not support canvas'
      </canvas>
    </div>
  );
}