def load_story_from_txt(path):
    story = {}
    current_node = None

    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 將角色名字對應要顯示的人物圖
    CHARACTER_MAP = {'？？':'default.png',
                    '？？？':'default.png',
                    '':'default.png',
                    '我1':None,
                    '村民':'villager.png',
                    '？？？？':'Locey_speak.webp',
                    '？？？？1':'Locey_speak_angry.webp',
                    '我':'Locey.webp',
                    '洛希':'Locey_speak.webp',
                    '洛希1':'Locey_speak_angry.webp',
                    '洛希2':'Locey_speak_question.webp',
                    '洛希3':'Locey_speak_side.webp',
                    '洛希4':'Locey_speak_close.webp',
                    '洛希5':'Locey.webp',
                    '男子1':'default.png',
                    '男子2':'default.png',
                    '女子1':'default.png',
                    '女子2':'default.png',
                    '長官（？）':'default.png',
                    '下屬（？）':'default.png'
                    }


    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        if line.startswith('#NODE'):
            node_id = line.split()[1]
            current_node = {
                'background': '',
                'character': '',
                'dialogue': [],
                'choices': [],
                'endtype': None,
                'text': '',
                'endtitle':''
            }
            story[node_id] = current_node
            continue

        if current_node is None:
            continue

        if line.startswith('BG'):
            current_node['background'] = line.split(maxsplit=1)[1]
            continue

        if line.startswith('ENDTYPE'):
            current_node['endtype'] = line.split(maxsplit=1)[1]
            continue

        if line.startswith('TEXT'):
            current_node['text'] = line.split(maxsplit=1)[1]

        if line.startswith('ENDTITLE'):
            current_node['endtitle'] = line.split(maxsplit=1)[1]

        # 刑式: CHOICE text -> next
        if line.startswith('CHOICE'):
            rest = line[len('CHOICE'):].strip()
            if '->' in rest:
                text, nxt = map(str.strip, rest.split('->'))
                current_node['choices'].append({'text': text, 'next': nxt})
            continue

        # 形式: Name: text
        if '：' in line:
            name, text = line.split('：', 1)
            speaker = name.strip()
            character = CHARACTER_MAP.get(speaker)

            # 對話中切換背景 BG:xxx
            bg = None
            if 'BG:' in text:
                parts = text.split('BG:')
                text = parts[0].strip()
                bg = parts[1].strip()

            current_node['dialogue'].append({
                'name': speaker,
                'text': text.strip(),
                'character': character,
                'background': bg
            })
            continue

    return story
