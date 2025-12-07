// added coalesce to account for unaccounted values -> transparent about missing data

const X_FIELDS = {
  year: `EXTRACT(YEAR FROM TO_DATE(A.Published, 'YYYY-MM-DD'))`,
  journal: `A.ISSN`,
  country: `COALESCE(C.Name, '?')`,
  institution: `I.Name`,
  gender: `COALESCE(G.GenderLabel, '?')`,
  ethnicity: `COALESCE(R.RaceLabel, '?')`,
};

const Y_FIELDS = {
  publication_count: `COUNT(DISTINCT A.Title)`,
  citation_count: `SUM(A.Is_Referenced_By_Count)`,
  author_count: `COUNT(DISTINCT A.Author)`,
  impact_factor: `AVG(J.ImpactFactor)`
};

const GROUP_FIELDS = {
  none: null,
  gender: `COALESCE(G.GenderLabel, '?')`,
  country: `COALESCE(C.Name, '?')`,
  journal: `A.ISSN`,
  ethnicity: `COALESCE(R.RaceLabel, '?')`
};


export const LABELS = {
  x: {
    year: "Publication Year",
    journal: "Journal",
    country: "Country",
    institution: "Institution",
    category: "Journal Category",
    gender: "Gender",
    ethnicity: "Ethnicity",
  },
  y: {
    publication_count: "Number of Publications",
    citation_count: "Total Citations",
    author_count: "Unique Authors",
    percentage: "Percentage of Publications",
    impact_factor: "Average Impact Factor",
  },
  group: {
    none: null,
    gender: "Gender",
    country: "Country",
    journal: "Journal",
    ethnicity: "Ethnicity",
  }
};



// function to visualize statistics on articles in the database
export function buildVisualizationQuery({ x, y, groupBy = "none" }) {
  const xField = X_FIELDS[x];
  const yField = Y_FIELDS[y];
  const groupField = GROUP_FIELDS[groupBy];

  if (!xField || !yField) {
    throw new Error("Invalid visualization parameters");
  }

  const groupSelect = groupField ? `${groupField} AS group_value,` : "";
  const groupByClause = groupField ? `, ${groupField}` : "";

  const query = `
    SELECT 
      ${xField} AS x,
      ${groupSelect}
      ${yField} AS y
    FROM Articles A
    LEFT JOIN Author Au 
      ON Au.Name = A.Author
    LEFT JOIN Gender G 
      ON G.Name = split_part(A.Author, ' ', 1)
    LEFT JOIN Race R 
      ON R.Name = A.Author
    LEFT JOIN Institutions I 
      ON I.Name = Au.Affiliation
    LEFT JOIN Countries C 
      ON C.CountryCode = I.CountryCode
    LEFT JOIN Journals J 
      ON J.ISSN = A.ISSN
    GROUP BY x${groupByClause}
    ORDER BY x;
  `;

  return ({
    query,
    xLabel: LABELS.x[x],
    yLabel: LABELS.y[y],
    groupLabel: LABELS.group[groupBy],
  })
}
