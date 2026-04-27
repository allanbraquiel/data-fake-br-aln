#!/usr/bin/env python3
"""Gera os ícones da extensão Data Fake Brasil em vários tamanhos."""
from PIL import Image, ImageDraw
import os

def draw_icon(size):
    """Desenha ícone de mão preenchendo formulário."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size

    # Escala proporcional
    def sc(v):
        return int(v * s / 128)

    # Fundo arredondado (verde #0f766e)
    bg_color = (15, 118, 110)  # mesmo verde do botão "Preencher formulário"
    r = sc(18)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=bg_color)

    # --- Documento / Formulário (retângulo branco) ---
    doc_x1, doc_y1 = sc(18), sc(14)
    doc_x2, doc_y2 = sc(82), sc(90)
    d.rounded_rectangle([doc_x1, doc_y1, doc_x2, doc_y2], radius=sc(6), fill=(255, 255, 255))

    # Linhas do formulário
    line_color = (180, 200, 240)
    line_w = max(1, sc(3))
    lx1, lx2 = sc(26), sc(74)
    for y in [sc(30), sc(44), sc(58), sc(72)]:
        d.rectangle([lx1, y, lx2, y + line_w], fill=line_color)

    # --- Mão / Caneta escrevendo (canto inferior direito) ---
    # Corpo da caneta (retângulo inclinado simulado com polígono)
    pen_color = (255, 200, 0)        # amarelo ouro
    pen_tip_color = (60, 60, 60)     # ponta escura
    pen_clip_color = (200, 160, 0)   # grampo da caneta

    # Caneta inclinada ~45°
    px = sc(62)
    py = sc(62)
    pen_pts = [
        (px,        py),
        (px + sc(20), py - sc(20)),
        (px + sc(28), py - sc(12)),
        (px + sc(8),  py + sc(8)),
    ]
    d.polygon(pen_pts, fill=pen_color)

    # Ponta da caneta (triângulo)
    tip_pts = [
        (px,        py),
        (px + sc(8),  py + sc(8)),
        (px + sc(2),  py + sc(14)),
    ]
    d.polygon(tip_pts, fill=pen_tip_color)

    # Borda da caneta
    d.polygon(pen_pts, outline=(180, 140, 0), width=max(1, sc(2)))

    # Ponto de escrita (pequeno círculo azul = tinta)
    dot_x = px + sc(1)
    dot_y = py + sc(13)
    dot_r = max(1, sc(3))
    d.ellipse([dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r],
              fill=(15, 118, 110))

    return img


sizes = [16, 32, 48, 128]
icons_dir = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(icons_dir, exist_ok=True)

for sz in sizes:
    icon = draw_icon(sz)
    path = os.path.join(icons_dir, f"icon{sz}.png")
    icon.save(path, "PNG")
    print(f"Criado: {path}")

print("Ícones gerados com sucesso!")
