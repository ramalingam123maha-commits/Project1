import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

st.set_page_config(
    page_title="Sales Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Load data ──────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    df = pd.read_csv("sample_sales_data.csv", parse_dates=["date"])
    df["year_month"] = df["date"].dt.to_period("M").astype(str)
    df["month_name"] = df["date"].dt.strftime("%b %Y")
    return df

df = load_data()

# ── Sidebar filters ────────────────────────────────────────────────────────
st.sidebar.title("📊 Dashboard Filters")
st.sidebar.markdown("---")

all_regions = sorted(df["region"].unique())
all_categories = sorted(df["category"].unique())

regions = st.sidebar.multiselect(
    "Region",
    options=all_regions,
    default=all_regions,
)
categories = st.sidebar.multiselect(
    "Category",
    options=all_categories,
    default=all_categories,
)

min_date = df["date"].min()
max_date = df["date"].max()
date_range = st.sidebar.date_input(
    "Date Range",
    value=(min_date, max_date),
    min_value=min_date,
    max_value=max_date,
)

metric = st.sidebar.radio(
    "Metric",
    options=["Sales", "Quantity", "Profit"],
    index=0,
    horizontal=True,
)

chart_theme = st.sidebar.selectbox(
    "Chart Theme",
    options=["plotly", "plotly_dark", "ggplot2", "seaborn", "simple_white"],
    index=0,
)

# ── Filter data ────────────────────────────────────────────────────────────
filtered_df = df[
    (df["region"].isin(regions))
    & (df["category"].isin(categories))
    & (df["date"] >= pd.Timestamp(date_range[0]))
    & (df["date"] <= pd.Timestamp(date_range[1]))
]

metric_col = metric.lower()
color_map = px.colors.qualitative.Plotly

# ── KPI cards ──────────────────────────────────────────────────────────────
total_sales = filtered_df["sales"].sum()
total_qty = filtered_df["quantity"].sum()
total_profit = filtered_df["profit"].sum()
avg_profit_margin = (total_profit / total_sales * 100) if total_sales > 0 else 0
n_transactions = len(filtered_df)

st.title("📈 Sales Performance Dashboard")
st.markdown("Interactive data visualization dashboard built with **Streamlit**, **Pandas**, and **Plotly**.")

col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("Total Sales", f"${total_sales:,.0f}")
col2.metric("Total Quantity", f"{total_qty:,}")
col3.metric("Total Profit", f"${total_profit:,.0f}")
col4.metric("Profit Margin", f"{avg_profit_margin:.1f}%")
col5.metric("Transactions", f"{n_transactions:,}")

st.markdown("---")

# ── Row 1: Sales by Category (bar) + Sales by Region (pie) ────────────────
fig_col1, fig_col2 = st.columns(2)

with fig_col1:
    cat_agg = filtered_df.groupby("category", as_index=False)[metric_col].sum()
    fig_bar = px.bar(
        cat_agg,
        x="category",
        y=metric_col,
        color="category",
        title=f"{metric} by Category",
        text_auto=".2s",
        color_discrete_sequence=color_map,
        template=chart_theme,
    )
    fig_bar.update_layout(showlegend=False, xaxis_title="", height=400)
    fig_bar.update_traces(textposition="outside")
    st.plotly_chart(fig_bar, use_container_width=True)

with fig_col2:
    region_agg = filtered_df.groupby("region", as_index=False)[metric_col].sum()
    fig_pie = px.pie(
        region_agg,
        names="region",
        values=metric_col,
        title=f"{metric} by Region",
        color_discrete_sequence=color_map,
        template=chart_theme,
        hole=0.4,
    )
    fig_pie.update_traces(textposition="inside", textinfo="percent+label")
    st.plotly_chart(fig_pie, use_container_width=True)

# ── Row 2: Monthly trend (line) ────────────────────────────────────────────
monthly = (
    filtered_df.groupby(["year_month", "month_name"], as_index=False)[metric_col]
    .sum()
    .sort_values("year_month")
)
fig_line = px.line(
    monthly,
    x="month_name",
    y=metric_col,
    markers=True,
    title=f"{metric} Over Time (Monthly)",
    template=chart_theme,
    color_discrete_sequence=[color_map[0]],
)
fig_line.update_layout(xaxis_title="", yaxis_title=metric, height=400)
st.plotly_chart(fig_line, use_container_width=True)

# ── Row 3: Sales vs Profit scatter + Top products bar ─────────────────────
fig_col3, fig_col4 = st.columns(2)

with fig_col3:
    product_agg = (
        filtered_df.groupby("product", as_index=False)
        .agg({"sales": "sum", "profit": "sum", "quantity": "sum"})
    )
    fig_scatter = px.scatter(
        product_agg,
        x="sales",
        y="profit",
        size="quantity",
        color="product",
        hover_name="product",
        title="Sales vs Profit (bubble = quantity sold)",
        template=chart_theme,
        height=450,
    )
    fig_scatter.update_layout(showlegend=False)
    st.plotly_chart(fig_scatter, use_container_width=True)

with fig_col4:
    top_products = (
        filtered_df.groupby("product", as_index=False)[metric_col]
        .sum()
        .sort_values(metric_col, ascending=False)
        .head(10)
    )
    fig_hbar = px.bar(
        top_products,
        x=metric_col,
        y="product",
        orientation="h",
        color=metric_col,
        title=f"Top 10 Products by {metric}",
        text_auto=".2s",
        template=chart_theme,
        color_continuous_scale="Blues",
        height=450,
    )
    fig_hbar.update_layout(xaxis_title=metric, yaxis_title="")
    st.plotly_chart(fig_hbar, use_container_width=True)

# ── Row 4: Treemap (hierarchical view) ────────────────────────────────────
tree_agg = (
    filtered_df.groupby(["region", "category", "product"], as_index=False)[
        metric_col
    ]
    .sum()
)
fig_tree = px.treemap(
    tree_agg,
    path=["region", "category", "product"],
    values=metric_col,
    color=metric_col,
    color_continuous_scale="Blues",
    title=f"{metric} Treemap — Region > Category > Product",
    template=chart_theme,
    height=500,
)
fig_tree.update_traces(textinfo="label+value")
st.plotly_chart(fig_tree, use_container_width=True)

st.markdown("---")

# ── Raw data expander ──────────────────────────────────────────────────────
with st.expander("🔍 View Raw Data"):
    st.dataframe(filtered_df, use_container_width=True, hide_index=True)

st.markdown(
    "<div style='text-align: center; color: gray; font-size: 0.85rem;'>"
    "Built with ❤️ using Streamlit • Pandas • Plotly</div>",
    unsafe_allow_html=True,
)