const X_FIELDS = {
  year: `EXTRACT(YEAR FROM TO_DATE(A.Published, 'YYYY-MM-DD'))`,
  journal: `A.ISSN`,
  country: `C.Name`,
  institution: `I.Name`,
  category: `J.Category`,
  gender: `G.GenderLabel`,
  ethnicity: `R.RaceLabel`,
};


const Y_FIELDS = {
  publication_count: `COUNT(DISTINCT A.Title)`,
  citation_count: `SUM(A.Is_Referenced_By_Count)`,
  author_count: `COUNT(DISTINCT A.Author)`,
  percentage: `COUNT(*)`, // frontend handles normalization
  impact_factor: `AVG(J.ImpactFactor)`
};

const GROUP_FIELDS = {
  none: null,
  gender: `G.GenderLabel`,
  country: `C.Name`,
  journal: `A.ISSN`,
  ethnicity: `R.RaceLabel`
};


export function buildVisualizationQuery({
  x,
  y,
  groupBy = "none",  
}) {
  const xField = X_FIELDS[x];
  const yField = Y_FIELDS[y];
  const groupField = GROUP_FIELDS[groupBy];

  if (!xField || !yField) {
    throw new Error("Invalid visualization parameters");
  }

  const groupSelect = groupField ? `${groupField} AS group_value,` : "";
  const groupByClause = groupField ? `, ${groupField}` : "";

  return `
    SELECT 
      ${xField} AS x,
      ${groupSelect}
      ${yField} AS y
    FROM Articles A
    LEFT JOIN Author Au ON Au.Name = A.Author
    LEFT JOIN Gender G ON G.Name = split_part(A.Author, ' ', 1)
    LEFT JOIN Race R ON R.Name = A.Author
    LEFT JOIN Institutions I ON I.Name = Au.Affiliation
    LEFT JOIN Countries C ON C.CountryCode = I.CountryCode
    LEFT JOIN Journals J ON J.ISSN = A.ISSN
    GROUP BY x${groupByClause}
    ORDER BY x;
  `;
}

