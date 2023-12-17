import Link from "next/link";
import Tile from "@/components/Settings/Tile";
import SyncTile from "@/components/Settings/SyncTile";

export default function AccountSettings() {
  return (
    <div className="px-8 pt-10">
      <Link href={`/settings/account/changePicture`}>
        <Tile
          description="Change Profile Picture"
          type="normal"
          logo="addPhoto"
        />
      </Link>
      <Link href={`/settings/account/changeUsername`}>
        <Tile description="Change Display Name" type="normal" logo="rename" />
      </Link>
      <SyncTile />
    </div>
  );
}
