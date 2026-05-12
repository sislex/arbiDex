import { useEffect, useMemo } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectRpcUrlDataResponse,
} from '../../store/db-config/dbConfig.selectors';

export function RpcUrlsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const rpcUrlsFromStore = useAppSelector(selectRpcUrlDataResponse);
  const chains = useAppSelector(selectChainsDataResponse);

  useEffect(() => {
    dispatch(dbConfigActions.setRpcUrlsData());
    dispatch(dbConfigActions.setChainsData());
  }, [dispatch]);

  const chainById = useMemo(() => {
    return new Map(chains.map((chain: any) => [chain.chainId ?? chain.id, chain.name]));
  }, [chains]);

  const rpcUrls = useMemo(() => {
    return rpcUrlsFromStore.map((rpcUrl: any) => ({
      id: rpcUrl.rpcUrlId ?? rpcUrl.id,
      rpcUrl: rpcUrl.rpcUrl ?? rpcUrl.url ?? '',
      chainName: rpcUrl.chainName ?? chainById.get(rpcUrl.chainId) ?? rpcUrl.chainId ?? '',
      raw: rpcUrl,
    }));
  }, [chainById, rpcUrlsFromStore]);

  const t = {
    en: {
      rpcUrlId: 'Rpc Url ID',
      rpcUrl: 'Rpc Url',
      chainName: 'Chain Name',
    },
    ru: {
      rpcUrlId: 'Rpc Url ID',
      rpcUrl: 'Rpc Url',
      chainName: 'Chain Name',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].rpcUrlId, sortable: true, filterable: true },
    {
      key: 'rpcUrl',
      label: t[language].rpcUrl,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        columns={columns}
        data={rpcUrls}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => console.log('Delete', row)}
      />
    </div>
  );
}
