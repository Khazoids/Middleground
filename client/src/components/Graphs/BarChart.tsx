import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { SearchResult } from "../../types/Search";
import { LABEL_TRUNCATION_LENGTH } from "../../types/Graph";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps extends SearchResult {
  isCurrentItem: boolean;
}

interface BarChartComponentProps {
  products: BarChartProps[];
  onClickItem?: (productId: string) => void;
  cachedItems?: Map<string, SearchResult>;
}

const BarChart = ({
  products,
  onClickItem,
  cachedItems,
}: BarChartComponentProps) => {
  const navigate = useNavigate();
  const names = products.map((product) => product.product.name);
  const prices = products.map((product) => product.product.price);
  const productIds = products.map((product) => product.product._id);
  const backgroundColors = products.map((product) => {
    return product.isCurrentItem
      ? "rgba(75, 192, 132, 0.5)"
      : "rgba(99, 132, 255, 0.5)";
  });

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const handleBarClick = (event: any, elements: any) => {
    if (elements.length === 0) return;

    const index = elements[0].index;
    const clickedProduct = products[index];

    // Verify the product has a valid ID before proceeding
    if (
      !clickedProduct ||
      !clickedProduct.product ||
      !clickedProduct.product._id
    ) {
      console.error("Invalid product data:", clickedProduct);
      return;
    }

    const clickedProductId = clickedProduct.product._id;

    if (onClickItem) {
      onClickItem(clickedProductId);
    } else if (!clickedProduct.isCurrentItem) {
      // Navigate to the clicked product's page, using cached data if available
      // Only if it's not the current item we're viewing
      navigate(`/product/${clickedProductId}`, {
        state: cachedItems
          ? Array.from(cachedItems.values()).filter((item) => item?.product) // Filter out invalid items
          : products.filter((p) => p?.product), // Filter out invalid items
      });
    }
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Price of Similar Items",
        color: "black",
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return names[index]; // Show full name in tooltip
          },
          label: (context) => {
            const price = prices[context.dataIndex];
            return `$${price ? price.toFixed(2) : "N/A"}`;
          },
          afterLabel: () => "Click to view details",
        },
      },
    },
    onClick: handleBarClick,
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "black",
          callback: function (val: string | number) {
            return truncateString(
              this.getLabelForValue(val as number),
              LABEL_TRUNCATION_LENGTH
            );
          },
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
  };

  const data = {
    labels: names,
    datasets: [
      {
        label: "Price",
        data: prices,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: products.map((p) =>
          p.isCurrentItem
            ? "rgba(75, 192, 132, 0.7)"
            : "rgba(99, 132, 255, 0.7)"
        ),
        cursor: "pointer",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
