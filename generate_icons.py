#!/usr/bin/env python3
"""
Gera os ícones PNG para o PWA usando apenas a biblioteca padrão.
Execute: python3 generate_icons.py
Requer: Pillow (pip install Pillow)
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import math

    def draw_icon(size):
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Fundo arredondado azul
        radius = size * 0.22
        draw.rounded_rectangle([0, 0, size, size], radius=radius, fill="#1A2B4A")
        
        # Calendário simplificado (branco)
        pad = int(size * 0.18)
        top = int(size * 0.25)
        bot = int(size * 0.85)
        lw  = max(2, size // 32)
        
        draw.rounded_rectangle([pad, top, size-pad, bot], radius=size*0.05,
                                outline="white", width=lw, fill=None)
        draw.line([pad, int(size*0.42), size-pad, int(size*0.42)], fill="white", width=lw)
        
        # Traços de cabeçalho
        x1 = int(size*0.33); x2 = int(size*0.67)
        draw.line([x1, int(size*0.15), x1, int(size*0.28)], fill="white", width=lw)
        draw.line([x2, int(size*0.15), x2, int(size*0.28)], fill="white", width=lw)
        
        # Grid de células
        cols = [int(size*0.28), int(size*0.47), int(size*0.66)]
        rows = [int(size*0.52), int(size*0.66)]
        sq   = max(3, size // 20)
        for ci, cx in enumerate(cols):
            for ri, ry in enumerate(rows):
                color = "#2563EB" if (ci + ri) % 2 == 0 else "#93C5FD"
                draw.rounded_rectangle([cx-sq, ry-sq, cx+sq, ry+sq], 
                                       radius=2, fill=color)
        
        return img

    for sz in [192, 512]:
        img = draw_icon(sz)
        img.save(f"icons/icon-{sz}.png", "PNG")
        print(f"✅ icons/icon-{sz}.png gerado")

    print("\n🎉 Ícones criados com sucesso!")

except ImportError:
    print("❌ Pillow não instalado.")
    print("   Execute: pip install Pillow")
    print("   Ou baixe ícones manualmente em: https://favicon.io")
