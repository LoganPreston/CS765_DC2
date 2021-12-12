# CS765_DC2
This is a program to create tiny stacked bar charts in D3 for my CS 765 course at UW (Data visualization). The charts should be readable for trends at small sizes, though it may require more interaction to identify fine details

Notes about the sizes:

Large - there isn't too much that's overly exciting here. X axis has a mark for every other bar, and the y axis is every 10%. There are up to 10 colors available here, that should allow data to be readily visible. Small contributors, defined as less than 1% for this size, will be aggregated if the Other category is less than 1% or if they contribute to less than 0.5%

Medium - Compared to large there are half as many marks on both X and Y axes. Colors are restricted to 8. Aggregation to the Other category will happen if Other and the category is less than 3%, or if the category by itself is less than 1.5%. Bars are thinner and pulled closer together than the large chart

Small - this is smaller still. The main change at this level is departing from a stacked bar chart. Instead, data are presented as a stacked area plot. This allows consumers to still identify trends over time, find outliers, and other features that would be more visible at larger scale.
Some other features at this size:  Only 3 marks on either axis - one for each end and one in the middle. Colors are restricted to 6 unique values to allow distinguishability. The legend is removed and interaction is enabled to identify contributors. Aggregation steps up again - categories will be aggregated if the category and Other are less than 5% each, or if the category itself is less than 2.5%. This.
