import Link from "next/link";
import Tile from "@/components/Settings/Tile";

export default function AccountSettings() {
  return (
    <div className="px-8 pt-10">
      <h1 className="mb-10 text-center text-5xl">Account Settings</h1>
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
    </div>
  );
}
