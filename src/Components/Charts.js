import React, { Component } from "react";
import ReactTable from "react-table";
import { Bar, Line, HorizontalBar } from "react-chartjs-2";
import _ from "lodash";
import "chartjs-plugin-datalabels";
import "react-table/react-table.css";
import http from "axios";

export default class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      chartDataIndustry: [],
      chartDataTransaction: [],
      chartDataAccountant: []
    };
    this.getColumns = this.getColumns.bind(this);
    this.getChartData = this.getChartData.bind(this);
  }

  componentDidMount() {
    window.scroll(0, 0);
    http
      .get("https://my.api.mockaroo.com/client-profitability.json?key=67f40600")
      .then(response => {
        this.getChartData(response.data);
        this.setState({ data: response.data });
      });
  }

  getColumns() {
    const columns = [
      {
        Header: "Company",
        accessor: "company"
      },
      {
        Header: "Industry",
        accessor: "industry"
      },
      {
        Header: "Annual Revenue",
        accessor: "annual_revenue"
      },
      {
        Header: "# of employees",
        accessor: "number_of_employees"
      },
      {
        Header: "State",
        accessor: "state"
      },
      {
        Header: "Accounting Software",
        accessor: "accounting_software"
      },
      {
        Header: "Monthly Transaction Count",
        accessor: "total_monthly_transactions"
      },
      {
        Header: "Assigned Accountant",
        accessor: "assigned_accountant"
      },
      {
        Header: "Profit Margin",
        accessor: "profit_margin"
      }
    ];
    return columns;
  }

  getChartData(data) {
    const industries = _.keys(
      _.countBy(data, item => {
        return item.industry;
      })
    );
    const accountant = _.keys(
      _.countBy(data, item => {
        return item.assigned_accountant;
      })
    );
    const transactionCount = [
      "Less than 250",
      "251 - 500",
      "501 - 750",
      "More than 750"
    ];
    const profitValuesIndustry = [];
    const profitValuesAccountant = [];
    const profitValuesCount = [];
    let indexI = 0,
      indexA = 0,
      indexC = 0;
    //console.log(industries);
    for (let i = 0; i < data.length; i++) {
      indexI = industries.indexOf(data[i].industry);
      if (isNaN(profitValuesIndustry[indexI])) {
        profitValuesIndustry[indexI] = 0;
      } else {
        profitValuesIndustry[indexI] += data[i].profit_margin;
      }

      indexA = accountant.indexOf(data[i].assigned_accountant);
      if (isNaN(profitValuesAccountant[indexA])) {
        profitValuesAccountant[indexA] = 0;
      } else {
        profitValuesAccountant[indexA] += data[i].profit_margin;
      }

      if (data[i].total_monthly_transactions < 250) indexC = 0;
      else if (data[i].total_monthly_transactions < 500) indexC = 1;
      else if (data[i].total_monthly_transactions < 750) indexC = 2;
      else indexC = 3;
      if (isNaN(profitValuesCount[indexC])) {
        profitValuesCount[indexC] = 0;
      } else {
        profitValuesCount[indexC] += data[i].profit_margin;
      }
    }
    const chartDataIndustry = {
      labels: industries,
      datasets: [
        {
          label: "Industry",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: profitValuesIndustry
        }
      ]
    };
    const chartDataAccountant = {
      labels: accountant,
      datasets: [
        {
          label: "Accountants",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: profitValuesAccountant
        }
      ]
    };
    const chartDataTransaction = {
      labels: transactionCount,
      datasets: [
        {
          label: "Transaction Count",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: profitValuesCount
        }
      ]
    };
    this.setState({
      chartDataIndustry,
      chartDataAccountant,
      chartDataTransaction
    });
  }

  makeRandomColor() {
    let c = "";
    while (c.length < 7) {
      c += Math.random()
        .toString(16)
        .substr(-6)
        .substr(-1);
    }
    return "#" + c;
  }

  render() {
    return (
      <div className="container">
        <div className="chartContainer">
          <div className="industryContainer">
            <Bar data={this.state.chartDataIndustry} width={400} height={400} />
          </div>
          <div className="accountantContainer">
            <Line data={this.state.chartDataAccountant} />
          </div>
          <div className="transactionContainer">
            <HorizontalBar data={this.state.chartDataTransaction} />
          </div>
        </div>
        <div className="tableContainer">
          <ReactTable
            data={this.state.data}
            columns={this.getColumns()}
            showPagination
            resizable
            minRows={0}
            defaultPageSize={20}
          />
        </div>
      </div>
    );
  }
}
