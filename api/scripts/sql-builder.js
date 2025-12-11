// added coalesce to account for unaccounted values -> transparent about missing data

const X_FIELDS = {
  year: `EXTRACT(YEAR FROM TO_DATE(A.Published, 'YYYY-MM-DD'))`,
  journal: `COALESCE(J.LongName, A.Publisher)`,
  country: `COALESCE(C.Name, '?')`,
  institution: `I.Name`,
  gender: `COALESCE(G.GenderLabel, '?')`,
  ethnicity: `COALESCE(R.RaceLabel, '?')`,
};

const Y_FIELDS = {
  publication_count: `COUNT(DISTINCT A.Title)`,
  citation_count: `SUM(A.Is_Referenced_By_Count)`,
  author_count: `COUNT(DISTINCT A.Author)`,
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
    journal: "Journal ISSN",
    country: "Country",
    institution: "Institution",
    gender: "Gender",
    ethnicity: "Ethnicity",
  },
  y: {
    publication_count: "Number of Publications",
    citation_count: "Total Citations",
    author_count: "Unique Authors",
  },
  group: {
    none: null,
    gender: "Gender",
    country: "Country",
    journal: "Journal",
    ethnicity: "Ethnicity",
  }
};

function getTopKFilter(xField) {
  // map of which X fields should use top-5 filtering
  const denseFields = {
    country: "C.Name",
    journal: `COALESCE(J.LongName, A.ISSN)`,
    institution: "I.Name"
  };

  // only fire if xField is dense
  if (!(xField in denseFields)) return { cte: "", where: "" };

  const rawField = denseFields[xField];   // SQL column

  return {
    cte: `
      , top_x AS (
          SELECT ${rawField} AS val
          FROM Articles A
          LEFT JOIN Author Au ON Au.Name = A.Author
          LEFT JOIN Institutions I ON I.Name = Au.Affiliation
          LEFT JOIN Countries C ON C.CountryCode = I.CountryCode
          LEFT JOIN Journals J ON J.ISSN = A.ISSN
          WHERE ${rawField} IS NOT NULL   
          GROUP BY ${rawField}
          ORDER BY COUNT(*) DESC
          LIMIT 5
      )
    `,
    where: `AND ${rawField} IN (SELECT val FROM top_x)`
  };
}



function getTopXWhereClause(xField) {
  // MUST match the same map used in getTopKFilter()
  const denseFields = {
    country: "C.Name",
    journal: `COALESCE(J.LongName, A.ISSN)`,
    institution: "I.Name"
  };

  // only apply if this xField is dense
  if (!(xField in denseFields)) return "";

  const rawField = denseFields[xField];

  return `AND ${rawField} IN (SELECT val FROM top_x)`;
}





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

  // some of the fields are way too dense to plot: if selected edit the query to filter by the most prevalent top 5 categories
  // journals, countries, institution
  const topXCTE = getTopKFilter(x);
  const topXWhere = getTopXWhereClause(x);

  const query = `
    WITH
    base AS (
      SELECT A.*, Au.Affiliation, I.Name AS inst_name, C.Name AS country_name
      FROM Articles A
      LEFT JOIN Author Au ON Au.Name = A.Author
      LEFT JOIN Institutions I ON I.Name = Au.Affiliation
      LEFT JOIN Countries C ON C.CountryCode = I.CountryCode
    )
    ${topXCTE.cte}
    SELECT 
        ${xField} AS x,
        ${groupSelect}
        ${yField} AS y
    FROM Articles A
    LEFT JOIN Author Au ON Au.Name = A.Author
    LEFT JOIN Gender G ON G.Name = split_part(A.Author, ' ', 1)
    LEFT JOIN Race R ON R.Name = split_part(A.Author, ' ', 1)
    LEFT JOIN Institutions I ON I.Name = Au.Affiliation
    LEFT JOIN Countries C ON C.CountryCode = I.CountryCode
    LEFT JOIN Journals J ON J.ISSN = A.ISSN
    WHERE 1=1
      ${topXWhere}
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
