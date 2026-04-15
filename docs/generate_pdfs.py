#!/usr/bin/env python3
"""Generate PDF documents from Dhivyuga analysis and redesign markdown files."""

import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable
)

DOCS_DIR = os.path.dirname(os.path.abspath(__file__))

def get_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontSize=22,
        spaceAfter=6,
        textColor=HexColor('#1a1a2e'),
    ))
    styles.add(ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=HexColor('#555555'),
        alignment=TA_CENTER,
        spaceAfter=20,
    ))
    styles.add(ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontSize=16,
        spaceBefore=18,
        spaceAfter=8,
        textColor=HexColor('#1a1a2e'),
    ))
    styles.add(ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontSize=13,
        spaceBefore=14,
        spaceAfter=6,
        textColor=HexColor('#2d3748'),
    ))
    styles.add(ParagraphStyle(
        'H3',
        parent=styles['Heading3'],
        fontSize=11,
        spaceBefore=10,
        spaceAfter=4,
        textColor=HexColor('#4a5568'),
    ))
    styles.add(ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        spaceAfter=6,
    ))
    styles.add(ParagraphStyle(
        'BulletItem',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        leftIndent=20,
        spaceAfter=3,
    ))
    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=10,
    ))
    styles.add(ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=10,
        textColor=HexColor('#ffffff'),
    ))
    styles.add(ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=HexColor('#888888'),
        alignment=TA_CENTER,
    ))
    return styles


def escape_html(text):
    """Escape HTML special chars for reportlab Paragraph."""
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    return text


def make_table(headers, rows, styles):
    """Create a formatted table from headers and row data."""
    s = styles
    header_paras = [Paragraph(f"<b>{escape_html(h)}</b>", s['TableHeader']) for h in headers]
    data = [header_paras]
    for row in rows:
        data.append([Paragraph(escape_html(str(cell)), s['TableCell']) for cell in row])

    col_count = len(headers)
    available = 6.5 * inch
    col_widths = [available / col_count] * col_count

    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#2d3748')),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#ffffff'), HexColor('#f7fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    return t


def parse_md_to_story(md_path, styles):
    """Parse a markdown file and convert to reportlab story elements."""
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    story = []
    i = 0
    in_table = False
    table_headers = []
    table_rows = []

    while i < len(lines):
        line = lines[i].rstrip('\n')

        # Skip empty lines
        if not line.strip():
            if in_table and table_headers:
                story.append(make_table(table_headers, table_rows, styles))
                story.append(Spacer(1, 8))
                in_table = False
                table_headers = []
                table_rows = []
            i += 1
            continue

        # Skip front-matter markers and code blocks
        if line.strip() == '---':
            if in_table and table_headers:
                story.append(make_table(table_headers, table_rows, styles))
                story.append(Spacer(1, 8))
                in_table = False
                table_headers = []
                table_rows = []
            story.append(HRFlowable(width="100%", thickness=1, color=HexColor('#cccccc'), spaceAfter=8, spaceBefore=8))
            i += 1
            continue

        if line.strip().startswith('```'):
            i += 1
            continue

        # Table row
        if '|' in line and line.strip().startswith('|'):
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            # Check if separator row
            if all(re.match(r'^[-:]+$', c) for c in cells):
                i += 1
                continue
            if not in_table:
                in_table = True
                table_headers = cells
            else:
                table_rows.append(cells)
            i += 1
            continue

        # If we were in a table but hit non-table line, flush
        if in_table and table_headers:
            story.append(make_table(table_headers, table_rows, styles))
            story.append(Spacer(1, 8))
            in_table = False
            table_headers = []
            table_rows = []

        # Headings
        if line.startswith('# ') and not line.startswith('## '):
            text = line[2:].strip()
            story.append(Paragraph(escape_html(text), styles['DocTitle']))
            i += 1
            continue

        if line.startswith('## '):
            text = line[3:].strip()
            story.append(Paragraph(escape_html(text), styles['H1']))
            i += 1
            continue

        if line.startswith('### '):
            text = line[4:].strip()
            story.append(Paragraph(escape_html(text), styles['H2']))
            i += 1
            continue

        if line.startswith('#### '):
            text = line[5:].strip()
            story.append(Paragraph(escape_html(text), styles['H3']))
            i += 1
            continue

        # Blockquote (subtitle)
        if line.startswith('> '):
            text = line[2:].strip()
            story.append(Paragraph(escape_html(text), styles['DocSubtitle']))
            i += 1
            continue

        # Bullet items
        if line.strip().startswith('- ') or line.strip().startswith('* '):
            text = line.strip()[2:].strip()
            # Handle bold markers
            text = escape_html(text)
            text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
            story.append(Paragraph(f"&#8226; {text}", styles['BulletItem']))
            i += 1
            continue

        # Checkbox items
        if '- [ ]' in line or '- [x]' in line:
            text = line.strip()
            text = text.replace('- [ ]', '[ ]').replace('- [x]', '[x]')
            story.append(Paragraph(escape_html(text), styles['BulletItem']))
            i += 1
            continue

        # Regular paragraph
        text = line.strip()
        if text:
            text = escape_html(text)
            text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
            story.append(Paragraph(text, styles['Body']))

        i += 1

    # Flush any remaining table
    if in_table and table_headers:
        story.append(make_table(table_headers, table_rows, styles))

    return story


def generate_pdf(md_filename, pdf_filename):
    """Generate a PDF from a markdown file."""
    md_path = os.path.join(DOCS_DIR, md_filename)
    pdf_path = os.path.join(DOCS_DIR, pdf_filename)

    styles = get_styles()

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
    )

    story = parse_md_to_story(md_path, styles)
    doc.build(story)
    print(f"Generated: {pdf_path}")


if __name__ == '__main__':
    generate_pdf('dhivyuga-deep-analysis.md', 'dhivyuga-deep-analysis.pdf')
    generate_pdf('dhivyuga-redesign-document.md', 'dhivyuga-redesign-document.pdf')
    print("Done! Both PDFs generated.")
