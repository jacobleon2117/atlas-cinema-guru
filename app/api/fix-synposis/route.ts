import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { titles } from "@/seed/titles";

export async function GET() {
  try {
    const columnsResult = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'titles' AND column_name LIKE 'syn%'
    `;
    
    const columnName = columnsResult.rows[0]?.column_name;
    
    if (!columnName) {
      return NextResponse.json({ error: "Synopsis column not found" }, { status: 500 });
    }

    let updatedCount = 0;
    
    for (const title of titles) {
      const query = `
        UPDATE titles 
        SET "${columnName}" = $1
        WHERE id = $2
      `;
      
      const updateResult = await sql.query(query, [title.synposis, title.id]);
      
      if (updateResult.rowCount && updateResult.rowCount > 0) {
        updatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} records. Column name: ${columnName}`,
      columnName
    });
  } catch (error) {
    console.error("Error fixing synopsis:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}