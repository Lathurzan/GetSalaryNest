import {
  Document, Page, Text, View, StyleSheet,
} from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#171717" },
  header: { marginBottom: 24, borderBottomWidth: 2, borderBottomColor: "#0f2b2b", paddingBottom: 12 },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0f2b2b" },
  sub: { fontSize: 9, color: "#737373", marginTop: 3 },

  cards: { flexDirection: "row", gap: 10, marginBottom: 22 },
  card: { flex: 1, padding: 12, backgroundColor: "#f5f5f5", borderRadius: 6 },
  cardLabel: { fontSize: 7, color: "#737373", textTransform: "uppercase", letterSpacing: 0.5 },
  cardValue: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 4 },

  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 8, marginTop: 6 },

  row: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5" },
  head: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#d4d4d4" },
  headCell: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#525252", textTransform: "uppercase" },

  cDate: { width: "16%" },
  cDesc: { width: "40%" },
  cCat: { width: "26%", color: "#737373" },
  cAmt: { width: "18%", textAlign: "right" },

  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5, marginTop: 2 },
  catRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 5 },

  footer: {
    position: "absolute", bottom: 28, left: 40, right: 40,
    fontSize: 7, color: "#a3a3a3", textAlign: "center",
    borderTopWidth: 0.5, borderTopColor: "#e5e5e5", paddingTop: 8,
  },
});

const gbp = (pence: number) =>
  `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface Props {
  monthLabel: string;
  userName: string;
  income: number;
  spent: number;
  saved: number;
  savingsTarget: number;
  categories: { _id: string; name: string; color: string; spent: number; count: number }[];
  expenses: {
    _id: string; amount: number; note?: string; date: string;
    category: { name: string };
  }[];
}

export default function MonthlyReport({
  monthLabel, userName, income, spent, saved, savingsTarget, categories, expenses,
}: Props) {
  const totalCat = categories.reduce((s, c) => s + c.spent, 0);
  const progress = savingsTarget ? Math.round((saved / savingsTarget) * 100) : 0;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>SalaryNest</Text>
          <Text style={s.sub}>{monthLabel} · {userName}</Text>
        </View>

        <View style={s.cards}>
          <View style={s.card}>
            <Text style={s.cardLabel}>Income</Text>
            <Text style={s.cardValue}>{gbp(income)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Spent</Text>
            <Text style={s.cardValue}>{gbp(spent)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Saved</Text>
            <Text style={s.cardValue}>{gbp(saved)}</Text>
            <Text style={{ fontSize: 7, color: "#737373", marginTop: 2 }}>
              {progress}% of {gbp(savingsTarget)} goal
            </Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Remaining</Text>
            <Text style={s.cardValue}>{gbp(income - spent)}</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Spending by category</Text>
        {categories.map((c) => (
          <View key={c._id} style={s.catRow}>
            <View style={[s.dot, { backgroundColor: c.color }]} />
            <Text style={{ width: "45%" }}>{c.name}</Text>
            <Text style={{ width: "20%", color: "#737373", fontSize: 9 }}>
              {c.count} txn
            </Text>
            <Text style={{ width: "15%", color: "#737373", fontSize: 9 }}>
              {totalCat ? Math.round((c.spent / totalCat) * 100) : 0}%
            </Text>
            <Text style={{ width: "20%", textAlign: "right", fontFamily: "Helvetica-Bold" }}>
              {gbp(c.spent)}
            </Text>
          </View>
        ))}

        <Text style={[s.sectionTitle, { marginTop: 20 }]}>
          All transactions ({expenses.length})
        </Text>

        <View style={s.head}>
          <Text style={[s.headCell, s.cDate]}>Date</Text>
          <Text style={[s.headCell, s.cDesc]}>Description</Text>
          <Text style={[s.headCell, s.cCat]}>Category</Text>
          <Text style={[s.headCell, s.cAmt]}>Amount</Text>
        </View>

        {expenses.map((e) => (
          <View key={e._id} style={s.row} wrap={false}>
            <Text style={s.cDate}>
              {new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
            </Text>
            <Text style={s.cDesc}>{e.note || e.category.name}</Text>
            <Text style={s.cCat}>{e.category.name}</Text>
            <Text style={s.cAmt}>{gbp(e.amount)}</Text>
          </View>
        ))}

        <Text
          style={s.footer}
          render={({ pageNumber, totalPages }) =>
            `Generated by SalaryNest · ${new Date().toLocaleDateString("en-GB")} · Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}