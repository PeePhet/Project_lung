import Main_box from "@/components/Main_box";
import Navbar from "@/components/Navbar";
import Sub_main from "@/components/Sub_main";
import Table_page from "./components/Table_page";
import User_info from "./components/User_info";
import User from "@/models/user";
import connect from "@/lib/db";


type Props = {
  searchParams: {
    u?: string;
  };
};

export default async function History({ searchParams }: Props) {
  const user_id = await searchParams;
  const id_u = user_id.u

  if (!id_u) {
    return <div>No user ID provided.</div>;
  }

  await connect();

  const user_info = await User.findById(id_u);
  const user_name = user_info.username
  const email = user_info.email
  return (
    <Main_box>
      <Navbar>
      </Navbar>
      <Sub_main>
        <User_info user_name={user_name} email={email}  />
        <Table_page symtoms={user_info?.symptoms} />
      </Sub_main>
    </Main_box>
  );
}
