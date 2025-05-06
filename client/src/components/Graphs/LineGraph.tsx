import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { PriceHistoryItem } from "../../types/Search";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  priceHistory: PriceHistoryItem[];
}

const LineGraph: React.FC<LineGraphProps> = ({ priceHistory }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const sortedPriceHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const needsReduction = sortedPriceHistory.length > 20;

  const fullDates = sortedPriceHistory.map((item) => formatDate(item.date));
  const fullPrices = sortedPriceHistory.map((item) => item.price);

  let displayDates = fullDates;
  let displayPrices = fullPrices;

  if (needsReduction) {
    const reducedData = reduceDataPoints(sortedPriceHistory);
    displayDates = reducedData.map((item) => formatDate(item.date));
    displayPrices = reducedData.map((item) => item.price);
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Price History",
        color: "black",
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toFixed(2)}`,
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "black",
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "black",
          callback: (value: any) => `$${value.toFixed(2)}`,
        },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
      axis: "x",
    },
  };

  const data = {
    labels: displayDates,
    datasets: [
      {
        label: "Price",
        data: displayPrices,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.2,
        pointRadius: (ctx) => {
          if (ctx.dataIndex > 0 && ctx.dataIndex < displayPrices.length - 1) {
            const prevValue = displayPrices[ctx.dataIndex - 1];
            const currValue = displayPrices[ctx.dataIndex];
            const nextValue = displayPrices[ctx.dataIndex + 1];

            if (
              Math.abs(currValue - prevValue) > 1 ||
              Math.abs(currValue - nextValue) > 1
            ) {
              return 5;
            }
          }
          return 3;
        },
        pointHoverRadius: 7,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

const reduceDataPoints = (
  priceHistory: PriceHistoryItem[]
): PriceHistoryItem[] => {
  if (priceHistory.length <= 2) return priceHistory;

  const result: PriceHistoryItem[] = [priceHistory[0]];

  for (let i = 1; i < priceHistory.length - 1; i++) {
    const prevPrice = priceHistory[i - 1].price;
    const currPrice = priceHistory[i].price;
    const nextPrice = priceHistory[i + 1].price;

    if (
      (currPrice > prevPrice && currPrice > nextPrice) ||
      (currPrice < prevPrice && currPrice < nextPrice) ||
      Math.abs(currPrice - prevPrice) > prevPrice * 0.05
    ) {
      result.push(priceHistory[i]);
    }
  }

  result.push(priceHistory[priceHistory.length - 1]);

  return result;
};

export default LineGraph;
