# ds-template

- [Repo template](https://github.com/iguacel/ds-template)
- [Use this template](https://github.com/new?template_name=ds-template&template_owner=iguacel&name=your-new-repo-name)

## Test sheet

[Edit](https://docs.google.com/spreadsheets/d/12JiOL7KOKFUtjF-BqprNguz5gt0YV8DwT31FaZ8Moss/edit?hl=es&gid=1867228829#gid=1867228829)

## Node scripts

- Cd project
  
```bash
  npm install && code .
 ```

- Put .env in place

```bash
cp /Users/jaalvarez/Documents/ENV/.env .
```

- Replace ds-template -> new repo name
- If not created with use this template, trash .git
- Execute copy-secrets.sh
- Create scripts
- Run

```bash
node scripts/01.js
```

- Add yaml in ./github/workflows

## Python scripts

```bash
source sose/bin/activate
```

Creating a requirements.txt
To create a requirements.txt file based on the currently installed packages in your environment:

```bash
pip freeze > requirements.txt
```

Installing New Packages and Updating requirements.txt
Install new packages using pip:

```bash
pip install package-name
```

Update requirements.txt to include the new packages:

```bash
pip freeze > requirements.txt
```

Deactivating the environment:

```bash
deactivate
```

Run or execute

```bash
python3 scripts/01py.py
```

- Add yaml in ./github/workflows

## Upload to FTP server

- Node script: auth/upload.js
- Make sure to replace ds-template -> new repo name
  
```bash
npm run upload
```
