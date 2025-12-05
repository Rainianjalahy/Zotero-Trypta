import { format } from "../utils/date";
import { getString } from "../utils/locale";

const ROOT_COLLECTION_PREFIX = "Projet revue systématique";
const SUBCOLLECTIONS = [
  "Import brut",
  "Déduplication",
  "Criblage titres résumés",
  "Texte intégral",
  "Inclus final",
  "Exclus final",
];
const STANDARD_TAGS = ["SR_TA_INCLUDE", "SR_TA_EXCLUDE", "SR_TA_MAYBE"];

function buildRootCollectionName(): string {
  const today = new Date();
  const stamp = format(today);
  return `${ROOT_COLLECTION_PREFIX} – ${stamp}`;
}

async function ensureTags(): Promise<void> {
  await Zotero.DB.executeTransaction(async () => {
    for (const tag of STANDARD_TAGS) {
      const existing = Zotero.Tags.getID(tag);
      if (!existing) {
        await Zotero.Tags.create(tag);
      }
    }
  });
}

async function createCollection(
  name: string,
  libraryID: number,
  parentID?: number,
): Promise<number> {
  const collection = new Zotero.Collection();
  collection.libraryID = libraryID;
  collection.name = name;
  if (typeof parentID === "number") {
    collection.parentID = parentID;
  }
  await collection.saveTx();
  return collection.id;
}

function getTargetLibraryID(win: _ZoteroTypes.MainWindow): number {
  const selected = win.ZoteroPane.getSelectedLibraryID();
  return selected ?? Zotero.Libraries.userLibraryID;
}

async function createSystematicReviewProject(
  win: _ZoteroTypes.MainWindow,
): Promise<void> {
  const libraryID = getTargetLibraryID(win);
  const rootName = buildRootCollectionName();
  const rootID = await createCollection(rootName, libraryID);

  for (const sub of SUBCOLLECTIONS) {
    await createCollection(sub, libraryID, rootID);
  }

  await ensureTags();

  const notification = new ztoolkit.ProgressWindow(addon.data.config.addonName, {
    closeTime: 5000,
    closeOnClick: true,
  });
  notification.createLine({
    text: getString("project-created", { args: { name: rootName } }),
    type: "success",
  });
  notification.show();
}

function registerMenu(win: _ZoteroTypes.MainWindow): void {
  const menuId = `${addon.data.config.addonRef}-menu`;
  const itemId = `${addon.data.config.addonRef}-new-project`;

  ztoolkit.Menu.unregister(menuId);
  ztoolkit.Menu.unregister(itemId);

  ztoolkit.Menu.register("menuTools", {
    tag: "menu",
    id: menuId,
    label: getString("menu-root"),
    subElementOptions: [
      {
        tag: "menuitem",
        id: itemId,
        label: getString("menu-new-project"),
        commandListener: async () => {
          await createSystematicReviewProject(win);
        },
      },
    ],
  });
}

export { registerMenu };
