import csv
import io
from typing import List, Any
from fastapi.responses import StreamingResponse

class ExportService:
    @staticmethod
    def export_to_csv(data: List[Any], filename: str) -> StreamingResponse:
        if not data:
            return StreamingResponse(iter([]), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})
            
        # Extract headers from first item (assuming pydantic models or dicts)
        first_item = data[0]
        if hasattr(first_item, '__dict__'):
            headers = [k for k in first_item.__dict__.keys() if not k.startswith('_')]
            dicts = [item.__dict__ for item in data]
        else:
            # SQLAlchemy model
            headers = [c.name for c in first_item.__table__.columns]
            dicts = [{c: getattr(item, c) for c in headers} for item in data]

        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        writer.writerows(dicts)
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    @staticmethod
    def export_to_excel(data: List[Any], filename: str) -> StreamingResponse:
        # Mocking excel export by returning CSV format for simplicity since openpyxl/pandas might not be present
        return ExportService.export_to_csv(data, filename.replace('.xlsx', '.csv'))

    @staticmethod
    def export_to_pdf(data: List[Any], filename: str) -> StreamingResponse:
        # Mocking PDF export
        content = f"PDF Export for {filename}\n\n"
        for item in data:
            content += str(item) + "\n"
            
        output = io.BytesIO()
        output.write(content.encode('utf-8'))
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
